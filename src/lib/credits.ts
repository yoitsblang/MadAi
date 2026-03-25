// Server-side credit management — all credit logic MUST go through this module.
// Client-side code should NEVER modify credits directly.

import prisma from '@/lib/db';
import { canAccessModule, getTierConfig } from '@/lib/tiers';

export const ADMIN_EMAIL = 'bslang97@gmail.com';

export interface CreditCheckResult {
  allowed: boolean;
  isAdmin: boolean;
  currentCredits: number;
  tier: string;
  error?: string;
}

export async function checkAndDeductCredits(
  userId: string,
  cost: number
): Promise<CreditCheckResult> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true, role: true, credits: true, subscriptionTier: true, creditsResetAt: true },
  });

  if (!user) {
    return { allowed: false, isAdmin: false, currentCredits: 0, tier: 'free', error: 'User not found' };
  }

  // Admin bypass — never deduct credits
  if (user.role === 'admin' || user.email === ADMIN_EMAIL) {
    return { allowed: true, isAdmin: true, currentCredits: user.credits, tier: user.subscriptionTier };
  }

  // Enterprise tier = unlimited credits
  if (user.subscriptionTier === 'enterprise') {
    return { allowed: true, isAdmin: false, currentCredits: user.credits, tier: 'enterprise' };
  }

  // Lazy monthly credit reset for paid subscribers
  if (user.creditsResetAt) {
    const now = new Date();
    const resetAt = new Date(user.creditsResetAt);
    if (now > resetAt) {
      const tierConfig = getTierConfig(user.subscriptionTier);
      if (tierConfig.creditsPerMonth > 0) {
        const nextReset = new Date(resetAt);
        nextReset.setMonth(nextReset.getMonth() + 1);
        await prisma.user.update({
          where: { id: userId },
          data: { credits: tierConfig.creditsPerMonth, creditsResetAt: nextReset },
        });
        // Re-read updated credits
        const refreshed = await prisma.user.findUnique({
          where: { id: userId },
          select: { credits: true },
        });
        if (refreshed) user.credits = refreshed.credits;
      }
    }
  }

  // Check balance
  if (user.credits < cost) {
    return {
      allowed: false,
      isAdmin: false,
      currentCredits: user.credits,
      tier: user.subscriptionTier,
      error: `Insufficient credits. Need ${cost}, have ${user.credits}.`,
    };
  }

  // Atomic deduction — prevents race conditions
  const updated = await prisma.user.update({
    where: { id: userId },
    data: { credits: { decrement: cost } },
    select: { credits: true },
  });

  // Safety: if credits went negative (concurrent requests), refund and reject
  if (updated.credits < 0) {
    await prisma.user.update({
      where: { id: userId },
      data: { credits: { increment: cost } },
    });
    return {
      allowed: false,
      isAdmin: false,
      currentCredits: 0,
      tier: user.subscriptionTier,
      error: 'Insufficient credits (concurrent request detected).',
    };
  }

  return { allowed: true, isAdmin: false, currentCredits: updated.credits, tier: user.subscriptionTier };
}

export async function checkModuleAccess(
  userId: string,
  module: string
): Promise<{ allowed: boolean; tier: string; requiredTier?: string }> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { subscriptionTier: true, role: true, email: true },
  });

  if (!user) return { allowed: false, tier: 'free' };

  // Admin bypass
  if (user.role === 'admin' || user.email === ADMIN_EMAIL) {
    return { allowed: true, tier: user.subscriptionTier };
  }

  const allowed = canAccessModule(user.subscriptionTier, module);
  return { allowed, tier: user.subscriptionTier };
}

// Refund credits (e.g., if AI call fails after deduction)
export async function refundCredits(userId: string, amount: number): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true, email: true },
  });
  // Don't refund admin (they weren't charged)
  if (user?.role === 'admin' || user?.email === ADMIN_EMAIL) return;

  await prisma.user.update({
    where: { id: userId },
    data: { credits: { increment: amount } },
  });
}
