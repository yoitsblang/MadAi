import type { ModuleType } from '@/lib/types/business';

export interface TemplateType {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'research' | 'planning' | 'optimization' | 'branding';
  moduleSequence: ModuleType[];
  starterPrompt: string;
  tags: string[];
}

export const STRATEGY_TEMPLATES: TemplateType[] = [
  {
    id: 'competitive-analysis',
    name: 'Competitive Analysis',
    description:
      'Research your competitors, find gaps in the market, and position your business against them with clarity.',
    icon: 'Search',
    category: 'research',
    moduleSequence: ['intake', 'market-research', 'value-diagnosis', 'strategy-macro'],
    starterPrompt:
      'I want to do a competitive analysis. Help me identify my top competitors, understand their strengths and weaknesses, find gaps in the market, and figure out how to position against them.',
    tags: ['competitors', 'market gaps', 'positioning', 'research'],
  },
  {
    id: 'go-to-market',
    name: 'Go-to-Market Plan',
    description:
      'Build a full launch strategy from positioning and messaging to channel selection and rollout timeline.',
    icon: 'Rocket',
    category: 'planning',
    moduleSequence: [
      'intake',
      'value-diagnosis',
      'market-research',
      'psychology',
      'strategy-macro',
      'strategy-meso',
      'strategy-micro',
      'timing',
    ],
    starterPrompt:
      'I need a go-to-market plan. Walk me through positioning, messaging, channel selection, and a phased launch timeline for my product or service.',
    tags: ['launch', 'GTM', 'channels', 'rollout', 'positioning'],
  },
  {
    id: 'content-strategy',
    name: 'Content Strategy',
    description:
      'Define your content pillars, plan a publishing calendar, and choose the right platforms for your audience.',
    icon: 'FileEdit',
    category: 'planning',
    moduleSequence: [
      'intake',
      'psychology',
      'platform-power',
      'strategy-meso',
      'strategy-micro',
      'timing',
    ],
    starterPrompt:
      'I want to build a content strategy. Help me define content pillars, choose the right platforms, and create a realistic publishing calendar that drives business results.',
    tags: ['content', 'social media', 'calendar', 'platforms', 'publishing'],
  },
  {
    id: 'brand-positioning',
    name: 'Brand Positioning',
    description:
      'Define your brand identity, voice, and differentiation so you stand out in a crowded market.',
    icon: 'Gem',
    category: 'branding',
    moduleSequence: [
      'intake',
      'value-diagnosis',
      'psychology',
      'market-research',
      'strategy-macro',
    ],
    starterPrompt:
      'I need help with brand positioning. Help me define my brand identity, voice, values, and how I differentiate from competitors in a way that resonates with my target audience.',
    tags: ['brand', 'identity', 'voice', 'differentiation', 'messaging'],
  },
  {
    id: 'growth-audit',
    name: 'Growth Audit',
    description:
      'Diagnose what is working and what is not in your business, and find the bottlenecks holding you back.',
    icon: 'BarChart3',
    category: 'optimization',
    moduleSequence: [
      'intake',
      'business-logic',
      'value-diagnosis',
      'platform-power',
      'strategy-macro',
    ],
    starterPrompt:
      'I want a growth audit. Help me figure out what is working in my business, what is failing, where the bottlenecks are, and what I should focus on to unlock the next stage of growth.',
    tags: ['growth', 'audit', 'bottlenecks', 'diagnosis', 'optimization'],
  },
  {
    id: 'campaign-brief',
    name: 'Campaign Brief',
    description:
      'Plan a specific marketing campaign end-to-end, from objective and audience to creative and measurement.',
    icon: 'Megaphone',
    category: 'planning',
    moduleSequence: [
      'intake',
      'psychology',
      'strategy-meso',
      'strategy-micro',
      'timing',
      'ethics',
    ],
    starterPrompt:
      'I want to plan a marketing campaign. Help me define the objective, target audience, messaging, creative direction, channels, budget allocation, and success metrics.',
    tags: ['campaign', 'ads', 'creative', 'budget', 'metrics'],
  },
  {
    id: 'price-optimization',
    name: 'Price Optimization',
    description:
      'Analyze your pricing strategy, understand willingness to pay, and find the right price point for maximum revenue.',
    icon: 'DollarSign',
    category: 'optimization',
    moduleSequence: [
      'intake',
      'value-diagnosis',
      'business-logic',
      'market-research',
      'psychology',
      'strategy-macro',
    ],
    starterPrompt:
      'I want to optimize my pricing. Help me analyze my current pricing strategy, understand what my customers are willing to pay, and find the price point that maximizes revenue without killing conversion.',
    tags: ['pricing', 'revenue', 'margins', 'value-based', 'monetization'],
  },
  {
    id: 'platform-independence',
    name: 'Platform Independence',
    description:
      'Reduce your dependency on any single platform and build owned channels that you control.',
    icon: 'Shield',
    category: 'optimization',
    moduleSequence: [
      'intake',
      'platform-power',
      'business-logic',
      'strategy-macro',
      'strategy-meso',
      'innovation',
    ],
    starterPrompt:
      'I want to reduce my platform dependency. Help me audit which platforms I rely on, assess the risk, and build a plan to diversify into owned channels so my business is not at the mercy of algorithm changes.',
    tags: ['platforms', 'independence', 'owned channels', 'risk', 'diversification'],
  },
];
