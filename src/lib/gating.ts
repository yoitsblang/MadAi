// Centralized feature gating for MadAi
// All feature access checks go through here

import { getTierConfig } from '@/lib/tiers';
import type { SubscriptionTier } from '@/lib/tiers';

export function canUseFeature(tier: string, feature: string): boolean {
  const config = getTierConfig(tier);
  const features = config.features as Record<string, unknown>;
  return !!features[feature];
}

export function getGateMessage(feature: string): { title: string; description: string; requiredTier: string } {
  const gates: Record<string, { title: string; description: string; requiredTier: string }> = {
    aiChat: {
      title: 'Unlock Sterling AI Chat',
      description: 'Upgrade to discuss strategy with Sterling, ask follow-up questions, and get real-time guidance tailored to your business.',
      requiredTier: 'starter',
    },
    financeTracker: {
      title: 'Finance Tracking',
      description: 'Track revenue, expenses, and ROI across your business. See where your money goes and what drives growth.',
      requiredTier: 'pro',
    },
    channelTracker: {
      title: 'Channel Analytics',
      description: 'Monitor performance across all your platforms. See which channels drive real results.',
      requiredTier: 'pro',
    },
    reasoningAi: {
      title: 'Deep Reasoning AI',
      description: 'Access Sterling\'s advanced reasoning model for deeper analysis, complex strategy questions, and multi-step thinking.',
      requiredTier: 'pro',
    },
    export: {
      title: 'Export Strategy Briefs',
      description: 'Download your complete strategy as a professional document you can share with partners, investors, or your team.',
      requiredTier: 'starter',
    },
    calendar: {
      title: 'Strategy Calendar',
      description: 'Plan campaigns, launches, and milestones on a visual timeline synced with your strategy.',
      requiredTier: 'pro',
    },
  };
  return gates[feature] || { title: 'Premium Feature', description: 'Upgrade to access this feature.', requiredTier: 'starter' };
}

export function canCreateSession(tier: string, currentSessionCount: number): boolean {
  const config = getTierConfig(tier);
  if (config.features.maxSessions === -1) return true;
  return currentSessionCount < config.features.maxSessions;
}

export function getSessionLimitMessage(tier: string): string {
  const config = getTierConfig(tier);
  if (config.features.maxSessions === -1) return '';
  return `Your ${config.label} plan allows ${config.features.maxSessions} project${config.features.maxSessions === 1 ? '' : 's'}. Upgrade for more.`;
}
