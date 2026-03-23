// Core business types for MadAi strategic intelligence system

export type EthicalStance = 'ethical-first' | 'balanced' | 'aggressive-but-defensible' | 'max-performance-with-warning';

export type BusinessStage = 'idea' | 'pre-launch' | 'early' | 'growing' | 'established' | 'struggling' | 'pivoting';

export type BusinessGoal = 'quick-cash' | 'stable-income' | 'brand-building' | 'scale' | 'experimentation' | 'turnaround';

export type BusinessType =
  | 'physical-product' | 'digital-product' | 'service' | 'saas'
  | 'creator-brand' | 'personal-brand' | 'agency' | 'ecommerce'
  | 'local-business' | 'brick-and-mortar' | 'nonprofit-with-revenue'
  | 'adult-content' | 'art-creative' | 'coaching-consulting'
  | 'food-beverage' | 'events' | 'marketplace' | 'other';

export type ValueType =
  | 'problem-solving' | 'status' | 'time-saving' | 'pain-reduction'
  | 'identity' | 'beauty' | 'belonging' | 'entertainment'
  | 'capability' | 'access' | 'convenience' | 'meaning'
  | 'aspiration' | 'novelty' | 'trust' | 'relief';

export interface BusinessProfile {
  id: string;
  createdAt: string;
  updatedAt: string;

  // Core identity
  name: string;
  description: string;
  businessType: BusinessType;
  stage: BusinessStage;

  // What you sell
  offering: string;
  offeringExists: boolean; // true = exists, false = idea stage
  pricePoint: string;

  // Who it's for
  targetAudience: string;
  audiencePain: string;
  audienceDesire: string;
  audienceSophistication: 'unaware' | 'problem-aware' | 'solution-aware' | 'product-aware' | 'most-aware';

  // Current state
  currentChannels: string[];
  currentTraction: string;
  availableAssets: string;
  geographicScope: string;

  // Resources & constraints
  budget: 'zero' | 'minimal' | 'moderate' | 'substantial';
  timeAvailable: 'minimal' | 'part-time' | 'full-time' | 'team';
  skillLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  contentComfort: 'none' | 'low' | 'medium' | 'high';
  salesComfort: 'none' | 'low' | 'medium' | 'high';
  techAbility: 'none' | 'basic' | 'intermediate' | 'advanced';

  // Goals & ethics
  primaryGoal: BusinessGoal;
  ethicalStance: EthicalStance;
  ethicalBoundaries: string;
  brandPersonality: string;

  // Intake completeness
  intakeComplete: boolean;
  intakeNotes: string;
}

export interface ValueDiagnosis {
  primaryValue: ValueType[];
  secondaryValue: ValueType[];
  valueClarity: number; // 0-100
  hiddenValueOpportunities: string[];
  framingIssues: string[];
  pricingAssessment: 'underpriced' | 'overpriced' | 'mis-contextualized' | 'well-priced';
  realVsPerceivedOffering: string;
  weakestLink: string;
  customerDesireMap: Record<string, string>;
}

export interface BusinessHealthScore {
  valueCreation: number; // 0-100
  marketing: number;
  sales: number;
  valueDelivery: number;
  finance: number;
  overallHealth: number;
  primaryBottleneck: string;
  bottleneckDetails: string;
  recommendations: string[];
}

export interface PlatformAnalysis {
  platforms: PlatformDependency[];
  overallSovereigntyScore: number; // 0-100, higher = more independent
  ownedVsRentedRatio: number; // 0-1
  criticalDependencies: string[];
  reductionStrategies: string[];
}

export interface PlatformDependency {
  platform: string;
  dependencyLevel: 'low' | 'medium' | 'high' | 'critical';
  revenueExposure: number; // percentage
  visibilityRole: string;
  risks: string[];
  alternatives: string[];
}

export interface StrategyLevel {
  macro: MacroStrategy;
  meso: MesoStrategy;
  micro: MicroStrategy;
}

export interface MacroStrategy {
  positioning: string;
  businessModelDirection: string;
  marketSelection: string;
  coreOfferStructure: string;
  pricingPhilosophy: string;
  channelPrioritization: string[];
  brandArchitecture: string;
  trustArchitecture: string;
  acquisitionModel: string;
  retentionModel: string;
  competitiveMoat: string[];
  platformDependenceReduction: string[];
}

export interface MesoStrategy {
  campaignThemes: string[];
  offerBundles: string[];
  launchSequence: string[];
  funnelDesign: string;
  audienceSegments: string[];
  contentPillars: string[];
  communityStrategy: string;
  shortVsLongTermTradeoffs: string;
}

export interface MicroStrategy {
  posts: string[];
  headlines: string[];
  hooks: string[];
  ctas: string[];
  landingPageSections: string[];
  outreachScripts: string[];
  adAngles: string[];
  creativeBriefs: string[];
  testMatrix: string[];
  weeklyPlan: string;
  dailySteps: string[];
  timingRecommendations: string[];
}

export interface EthicsEvaluation {
  tactic: string;
  effectivenessScore: number; // 0-100
  legitimacyScore: number; // 0-100
  deliversProportionalValue: boolean;
  misleading: boolean;
  regretBasedConversion: boolean;
  preysOnVulnerability: boolean;
  damagesLongTermTrust: boolean;
  sustainableIfCopied: boolean;
  overallVerdict: 'green' | 'yellow' | 'orange' | 'red';
  tradeoffExplanation: string;
}

// Session management
export interface StrategySession {
  id: string;
  createdAt: string;
  updatedAt: string;
  profile: BusinessProfile;
  messages: ChatMessage[];
  valueDiagnosis?: ValueDiagnosis;
  healthScore?: BusinessHealthScore;
  platformAnalysis?: PlatformAnalysis;
  strategy?: StrategyLevel;
  ethicsEvaluations?: EthicsEvaluation[];
  activeModule: ModuleType;
  researchCache: Record<string, string>;
}

export type ModuleType =
  | 'intake' | 'value-diagnosis' | 'business-logic' | 'platform-power'
  | 'market-research' | 'psychology' | 'ethics' | 'strategy-macro'
  | 'strategy-meso' | 'strategy-micro' | 'timing' | 'innovation'
  | 'teaching' | 'general';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  module: ModuleType;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export const MODULE_INFO: Record<ModuleType, { label: string; icon: string; description: string }> = {
  'intake': { label: 'Strategic Intake', icon: 'Target', description: 'Deep business understanding' },
  'value-diagnosis': { label: 'Value Diagnosis', icon: 'Gem', description: 'What value are you really creating?' },
  'business-logic': { label: 'Business Logic', icon: 'Cog', description: 'The Kaufman 5-part analysis' },
  'platform-power': { label: 'Platform & Power', icon: 'Shield', description: 'Platform dependency & sovereignty' },
  'market-research': { label: 'Market Research', icon: 'Search', description: 'Live competitive & market intelligence' },
  'psychology': { label: 'Psychology', icon: 'Brain', description: 'Deep audience psychology modeling' },
  'ethics': { label: 'Ethical Exchange', icon: 'Scale', description: 'Effectiveness vs legitimacy' },
  'strategy-macro': { label: 'Macro Strategy', icon: 'Map', description: 'Business model & positioning' },
  'strategy-meso': { label: 'Meso Strategy', icon: 'ClipboardList', description: 'Campaigns & funnels' },
  'strategy-micro': { label: 'Micro Strategy', icon: 'Pencil', description: 'Exact execution steps' },
  'timing': { label: 'Timing & Context', icon: 'Clock', description: 'When to do what' },
  'innovation': { label: 'Innovation Lab', icon: 'FlaskConical', description: 'Hybrid & novel strategies' },
  'teaching': { label: 'Learn Why', icon: 'BookOpen', description: 'Understand the principles' },
  'general': { label: 'General', icon: 'MessageSquare', description: 'Open strategic conversation' },
};

// Default empty business profile
export function createEmptyProfile(): BusinessProfile {
  return {
    id: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    name: '',
    description: '',
    businessType: 'other',
    stage: 'idea',
    offering: '',
    offeringExists: false,
    pricePoint: '',
    targetAudience: '',
    audiencePain: '',
    audienceDesire: '',
    audienceSophistication: 'unaware',
    currentChannels: [],
    currentTraction: '',
    availableAssets: '',
    geographicScope: '',
    budget: 'zero',
    timeAvailable: 'minimal',
    skillLevel: 'beginner',
    contentComfort: 'none',
    salesComfort: 'none',
    techAbility: 'none',
    primaryGoal: 'stable-income',
    ethicalStance: 'balanced',
    ethicalBoundaries: '',
    brandPersonality: '',
    intakeComplete: false,
    intakeNotes: '',
  };
}
