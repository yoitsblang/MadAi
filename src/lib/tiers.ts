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
    maxSessions: number; // -1 = unlimited
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
    creditsPerMonth: 50,
    modules: ['intake', 'value-diagnosis', 'business-logic', 'general'],
    features: { export: false, calendar: false, templates: false, priorityAi: false, maxSessions: 2 },
    description: 'Get started with core business analysis',
  },
  starter: {
    label: 'Starter',
    price: 19,
    creditsPerMonth: 200,
    modules: [
      'intake', 'value-diagnosis', 'business-logic', 'platform-power',
      'strategy-macro', 'strategy-meso', 'strategy-micro',
      'ethics', 'psychology', 'general',
    ],
    features: { export: false, calendar: false, templates: true, priorityAi: false, maxSessions: 5 },
    description: 'Full strategic pipeline with ethics & psychology',
  },
  pro: {
    label: 'Pro',
    price: 49,
    creditsPerMonth: 500,
    modules: ALL_MODULES,
    features: { export: true, calendar: false, templates: true, priorityAi: true, maxSessions: -1 },
    description: 'All modules including live research & innovation',
  },
  enterprise: {
    label: 'Enterprise',
    price: 99,
    creditsPerMonth: -1, // unlimited
    modules: ALL_MODULES,
    features: { export: true, calendar: true, templates: true, priorityAi: true, maxSessions: -1 },
    description: 'Unlimited everything with full platform access',
  },
};

// Credit costs per action type
// Pricing rationale (Claude API ~$0.03/msg avg):
//   1 credit = ~$0.04 cost → Free (50 cred) = ~$2 cost, Starter (200) = ~$8 cost on $19 price
//   Margin: Free = loss leader, Starter = 58% margin, Pro = 60% margin, Enterprise = 40%+ margin
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
