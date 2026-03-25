import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { stripe, STRIPE_PRICE_IDS, STRIPE_CREDIT_PACKS } from '@/lib/stripe';
import prisma from '@/lib/db';

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!stripe) {
    return NextResponse.json({ error: 'Payments not configured' }, { status: 503 });
  }

  try {
    const { type, tier, pack } = await req.json();
    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const baseUrl = process.env.NEXTAUTH_URL || 'https://mad-ai-one.vercel.app';
    let checkoutSession;

    if (type === 'subscription' && tier) {
      // Subscription checkout
      const priceId = STRIPE_PRICE_IDS[tier];
      if (!priceId) {
        return NextResponse.json({ error: 'Invalid tier' }, { status: 400 });
      }

      checkoutSession = await stripe.checkout.sessions.create({
        mode: 'subscription',
        payment_method_types: ['card'],
        line_items: [{ price: priceId, quantity: 1 }],
        customer_email: user.email,
        metadata: { userId: user.id, tier, type: 'subscription' },
        success_url: `${baseUrl}/pricing?success=true&tier=${tier}`,
        cancel_url: `${baseUrl}/pricing?canceled=true`,
      });
    } else if (type === 'credits' && pack) {
      // One-time credit purchase
      const packConfig = STRIPE_CREDIT_PACKS[pack];
      if (!packConfig || !packConfig.priceId) {
        return NextResponse.json({ error: 'Invalid credit pack' }, { status: 400 });
      }

      checkoutSession = await stripe.checkout.sessions.create({
        mode: 'payment',
        payment_method_types: ['card'],
        line_items: [{ price: packConfig.priceId, quantity: 1 }],
        customer_email: user.email,
        metadata: { userId: user.id, credits: String(packConfig.credits), type: 'credits' },
        success_url: `${baseUrl}/pricing?success=true&credits=${packConfig.credits}`,
        cancel_url: `${baseUrl}/pricing?canceled=true`,
      });
    } else {
      return NextResponse.json({ error: 'Invalid checkout type' }, { status: 400 });
    }

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error('[STRIPE] Checkout error:', error);
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}
