import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('[STRIPE] STRIPE_SECRET_KEY not set — payment features disabled');
}

export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2025-03-31.basil' as Stripe.LatestApiVersion })
  : null;

// Map tiers to Stripe price IDs (set these in Vercel env vars after creating products in Stripe)
export const STRIPE_PRICE_IDS: Record<string, string> = {
  starter: process.env.STRIPE_PRICE_STARTER || '',
  pro: process.env.STRIPE_PRICE_PRO || '',
  enterprise: process.env.STRIPE_PRICE_ENTERPRISE || '',
};

// One-time credit pack purchases
export const STRIPE_CREDIT_PACKS: Record<string, { credits: number; price: number; priceId: string }> = {
  small: { credits: 100, price: 5, priceId: process.env.STRIPE_PRICE_CREDITS_100 || '' },
  medium: { credits: 300, price: 12, priceId: process.env.STRIPE_PRICE_CREDITS_300 || '' },
  large: { credits: 1000, price: 35, priceId: process.env.STRIPE_PRICE_CREDITS_1000 || '' },
};
