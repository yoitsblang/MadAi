import { chat } from '@/lib/ai/gemini';
import { buildSystemPrompt } from '@/lib/ai/prompts/general';
import {
  MACRO_STRATEGY_PROMPT,
  MESO_STRATEGY_PROMPT,
  MICRO_STRATEGY_PROMPT,
} from '@/lib/ai/prompts/strategy';
import type { BusinessProfile } from '@/lib/types/business';
import { profileToContext } from './utils';

/**
 * Generates macro-level strategy: positioning, business model, market selection,
 * offer structure, pricing, channels, brand/trust architecture, acquisition,
 * retention, moat, and platform independence.
 */
export async function generateMacroStrategy(
  profile: BusinessProfile,
  diagnosis: string,
  platformAnalysis: string
): Promise<string> {
  const businessContext = profileToContext(profile);
  const systemPrompt = buildSystemPrompt(
    businessContext,
    profile.ethicalStance,
    'strategy-macro',
    MACRO_STRATEGY_PROMPT
  );

  return chat({
    systemPrompt,
    messages: [
      {
        role: 'user',
        parts: [
          {
            text: `Generate a complete Macro Strategy for this business. Use the value diagnosis and platform analysis below to inform your recommendations.\n\nBusiness Context:\n${businessContext}\n\n--- VALUE DIAGNOSIS ---\n${diagnosis}\n\n--- PLATFORM ANALYSIS ---\n${platformAnalysis}`,
          },
        ],
      },
    ],
    temperature: 0.8,
    maxTokens: 8192,
  });
}

/**
 * Generates meso-level strategy: campaign themes, offer bundles, launch sequencing,
 * funnel design, audience segments, content pillars, and owned channel development.
 */
export async function generateMesoStrategy(
  profile: BusinessProfile,
  macroStrategy: string
): Promise<string> {
  const businessContext = profileToContext(profile);
  const systemPrompt = buildSystemPrompt(
    businessContext,
    profile.ethicalStance,
    'strategy-meso',
    MESO_STRATEGY_PROMPT
  );

  return chat({
    systemPrompt,
    messages: [
      {
        role: 'user',
        parts: [
          {
            text: `Generate a complete Meso Strategy that bridges the macro strategy to execution. Design campaigns, funnels, content pillars, and launch sequences that fit this business's actual constraints.\n\nBusiness Context:\n${businessContext}\n\n--- MACRO STRATEGY ---\n${macroStrategy}`,
          },
        ],
      },
    ],
    temperature: 0.8,
    maxTokens: 8192,
  });
}

/**
 * Generates micro-level strategy: exact posts, headlines, hooks, CTAs,
 * landing page copy, outreach scripts, ad angles, test matrices,
 * weekly plans, and daily steps.
 */
export async function generateMicroStrategy(
  profile: BusinessProfile,
  mesoStrategy: string,
  constraints?: string
): Promise<string> {
  const businessContext = profileToContext(profile);
  const systemPrompt = buildSystemPrompt(
    businessContext,
    profile.ethicalStance,
    'strategy-micro',
    MICRO_STRATEGY_PROMPT
  );

  const constraintSection = constraints
    ? `\n\n--- ADDITIONAL CONSTRAINTS ---\n${constraints}`
    : '';

  return chat({
    systemPrompt,
    messages: [
      {
        role: 'user',
        parts: [
          {
            text: `Generate a complete Micro Strategy with copy-paste-ready execution items. Produce exact posts, headlines, hooks, CTAs, outreach scripts, ad angles, a weekly plan, and daily steps. Everything must match the brand voice and fit the operator's constraints.\n\nBusiness Context:\n${businessContext}\n\n--- MESO STRATEGY ---\n${mesoStrategy}${constraintSection}`,
          },
        ],
      },
    ],
    temperature: 0.9,
    maxTokens: 8192,
  });
}
