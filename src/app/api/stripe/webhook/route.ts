import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import prisma from '@/lib/db';
import { TIER_CONFIG } from '@/lib/tiers';
import type { SubscriptionTier } from '@/lib/tiers';

export async function POST(req: NextRequest) {
  if (!stripe) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 });
  }

  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Missing signature or webhook secret' }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('[STRIPE WEBHOOK] Signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const userId = session.metadata?.userId;
        const type = session.metadata?.type;

        if (!userId) break;

        if (type === 'subscription') {
          const tier = session.metadata?.tier as SubscriptionTier;
          const tierConfig = TIER_CONFIG[tier];
          if (!tierConfig) break;

          await prisma.user.update({
            where: { id: userId },
            data: {
              subscriptionTier: tier,
              credits: tierConfig.creditsPerMonth === -1 ? 999999 : tierConfig.creditsPerMonth,
              creditsResetAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
              stripeCustomerId: session.customer as string || undefined,
              stripeSubscriptionId: session.subscription as string || undefined,
            },
          });
          console.log(`[STRIPE] User ${userId} subscribed to ${tier}`);
        } else if (type === 'credits') {
          const credits = parseInt(session.metadata?.credits || '0', 10);
          if (credits > 0) {
            await prisma.user.update({
              where: { id: userId },
              data: { credits: { increment: credits } },
            });
            console.log(`[STRIPE] User ${userId} purchased ${credits} credits`);
          }
        }
        break;
      }

      case 'customer.subscription.updated': {
        const sub = event.data.object;
        const userId = sub.metadata?.userId;
        if (!userId) break;

        if (sub.status === 'active') {
          // Subscription renewed — refresh credits
          const tier = sub.metadata?.tier as SubscriptionTier;
          const tierConfig = TIER_CONFIG[tier];
          if (tierConfig) {
            await prisma.user.update({
              where: { id: userId },
              data: {
                credits: tierConfig.creditsPerMonth === -1 ? 999999 : tierConfig.creditsPerMonth,
                creditsResetAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
              },
            });
          }
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object;
        const userId = sub.metadata?.userId;
        if (!userId) break;

        // Downgrade to free
        await prisma.user.update({
          where: { id: userId },
          data: {
            subscriptionTier: 'free',
            credits: 50,
            stripeSubscriptionId: null,
          },
        });
        console.log(`[STRIPE] User ${userId} subscription canceled, downgraded to free`);
        break;
      }
    }
  } catch (error) {
    console.error('[STRIPE WEBHOOK] Processing error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
