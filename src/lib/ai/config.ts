// Centralized AI model configuration for MadAi
// All model references should import from here

export const AI_MODELS = {
  // Primary strategic model — used for all pipeline stages and analysis
  strategic: 'gemini-2.5-flash',
  // Reasoning model — deep thinking for Pro/Enterprise users
  reasoning: 'gemini-2.5-pro',
  // Light model — quick conversational responses
  casual: 'gemini-2.0-flash-lite',
} as const;

// Which modules use which model tier
const STRATEGIC_MODULES = new Set([
  'intake', 'value-diagnosis', 'business-logic', 'platform-power',
  'strategy-macro', 'strategy-meso', 'strategy-micro',
  'market-research', 'psychology', 'ethics',
]);

export function getModelForContext(module: string, tier: string): string {
  // Pro/Enterprise get reasoning model for strategic work
  if ((tier === 'pro' || tier === 'enterprise') && STRATEGIC_MODULES.has(module)) {
    return AI_MODELS.reasoning;
  }
  // All users get strategic model for pipeline stages
  if (STRATEGIC_MODULES.has(module)) {
    return AI_MODELS.strategic;
  }
  // Light model for utility modules (teaching, general, innovation, timing)
  return AI_MODELS.casual;
}

// Sterling — the AI persona name
export const AI_NAME = 'Sterling';
