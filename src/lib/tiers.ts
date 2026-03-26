// Tier definitions and module access control for MadAi

import type { ModuleType } from '@/lib/types/business';

export type SubscriptionTier = 'free' | 'starter' | 'pro' | 'enterprise';

export interface TierConfig {
  label: string;
  price: number;
  creditsPerMonth: number; // -1 = unlimited
  modules: ModuleType[];
  features: {
    export: boolean;
    calendar: boolean;
    templates: boolean;
    priorityAi: boolean;
    aiChat: boolean;        // Can interact with Sterling after pipeline
    financeTracker: boolean; // Revenue/spend tracking
    channelTracker: boolean; // Platform analytics
    reasoningAi: boolean;   // Gemini 3.1 Pro deep reasoning
    maxSessions: number;    // -1 = unlimited
  };
  description: string;
}

const ALL_MODULES: ModuleType[] = [
  'intake', 'value-diagnosis', 'business-logic', 'platform-power',
  'market-research', 'psychology', 'ethics', 'strategy-macro',
  'strategy-meso', 'strategy-micro', 'timing', 'innovation',
  'teaching', 'general',
];

export const TIER_CONFIG: Record<SubscriptionTier, TierConfig> = {
  free: {
    label: 'Free',
    price: 0,
    creditsPerMonth: 0, // No credits — free gets 1 pipeline walkthrough only
    modules: ALL_MODULES, // Can access all stages for the walkthrough
    features: {
      export: false, calendar: false, templates: false, priorityAi: false,
      aiChat: false, financeTracker: false, channelTracker: false, reasoningAi: false,
      maxSessions: 1,
    },
    description: 'One full strategy pipeline. Sterling plans it, you execute it.',
  },
  starter: {
    label: 'Starter',
    price: 14,
    creditsPerMonth: 500,
    modules: ALL_MODULES,
    features: {
      export: true, calendar: false, templates: true, priorityAi: false,
      aiChat: true, financeTracker: false, channelTracker: false, reasoningAi: false,
      maxSessions: 5,
    },
    description: 'Talk to Sterling, iterate on strategy, export briefs',
  },
  pro: {
    label: 'Pro',
    price: 39,
    creditsPerMonth: 2000,
    modules: ALL_MODULES,
    features: {
      export: true, calendar: true, templates: true, priorityAi: true,
      aiChat: true, financeTracker: true, channelTracker: true, reasoningAi: true,
      maxSessions: -1,
    },
    description: 'Deep reasoning AI, finance tracking, unlimited sessions',
  },
  enterprise: {
    label: 'Enterprise',
    price: 79,
    creditsPerMonth: -1, // unlimited
    modules: ALL_MODULES,
    features: {
      export: true, calendar: true, templates: true, priorityAi: true,
      aiChat: true, financeTracker: true, channelTracker: true, reasoningAi: true,
      maxSessions: -1,
    },
    description: 'Unlimited Sterling access, all features, priority support',
  },
};

// Credit costs per action type
// Pricing rationale (Gemini API: flash ~$0.01/msg, pro ~$0.05/msg):
//   Free = 1 pipeline walkthrough, no ongoing AI → $0 cost, pure lead gen
//   Starter ($14/mo, 500 credits): ~$5 API cost → 64% margin
//   Pro ($39/mo, 2000 credits): ~$20 API cost (includes reasoning model) → 49% margin
//   Enterprise ($79/mo, unlimited): heavy users ~$40-60 → 25-50% margin
export const CREDIT_COSTS = {
  chat: 1,           // Simple chat message
  analyze: 2,        // Analysis with structured output
  'analyze-full': 6, // Full multi-module analysis
  research: 3,       // Live research with web queries
  brief: 5,          // Strategy brief generation
  'plan-generate': 4, // Action plan generation
  'plan-modify': 2,   // Plan modification
} as const;

export function canAccessModule(tier: string, module: string): boolean {
  const config = TIER_CONFIG[tier as SubscriptionTier];
  if (!config) return false;
  return config.modules.includes(module as ModuleType);
}

export function getTierConfig(tier: string): TierConfig {
  return TIER_CONFIG[tier as SubscriptionTier] || TIER_CONFIG.free;
}

export function getNextTier(currentTier: string): SubscriptionTier | null {
  const order: SubscriptionTier[] = ['free', 'starter', 'pro', 'enterprise'];
  const idx = order.indexOf(currentTier as SubscriptionTier);
  return idx >= 0 && idx < order.length - 1 ? order[idx + 1] : null;
}

// Which tier is needed to access a specific module
export function requiredTierForModule(module: string): SubscriptionTier {
  const order: SubscriptionTier[] = ['free', 'starter', 'pro', 'enterprise'];
  for (const tier of order) {
    if (TIER_CONFIG[tier].modules.includes(module as ModuleType)) return tier;
  }
  return 'enterprise';
}
