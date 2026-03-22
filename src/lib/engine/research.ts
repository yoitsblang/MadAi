import { chat } from '@/lib/ai/gemini';
import { buildSystemPrompt } from '@/lib/ai/prompts/general';
import { RESEARCH_PROMPT } from '@/lib/ai/prompts/research';
import type { BusinessProfile } from '@/lib/types/business';
import { profileToContext } from './utils';

/**
 * Conducts market research using Gemini with search grounding enabled
 * for live, current data. Can accept specific research queries or
 * perform a general market research sweep.
 */
export async function conductMarketResearch(
  profile: BusinessProfile,
  specificQueries?: string[]
): Promise<string> {
  const businessContext = profileToContext(profile);
  const systemPrompt = buildSystemPrompt(
    businessContext,
    profile.ethicalStance,
    'market-research',
    RESEARCH_PROMPT
  );

  const querySection = specificQueries?.length
    ? `\n\nSpecific research questions to answer:\n${specificQueries.map((q, i) => `${i + 1}. ${q}`).join('\n')}`
    : '';

  return chat({
    systemPrompt,
    messages: [
      {
        role: 'user',
        parts: [
          {
            text: `Conduct comprehensive market research for this business. Use live search data to ground findings in reality. Cover competitive landscape, market dynamics, audience intelligence, pricing intelligence, channel opportunities, and cultural/timing context.${querySection}\n\nBusiness Context:\n${businessContext}`,
          },
        ],
      },
    ],
    enableSearchGrounding: true,
    temperature: 0.5,
    maxTokens: 8192,
  });
}

/**
 * Researches direct and indirect competitors using search grounding
 * for current, real-world competitive intelligence.
 */
export async function researchCompetitors(profile: BusinessProfile): Promise<string> {
  const businessContext = profileToContext(profile);
  const systemPrompt = buildSystemPrompt(
    businessContext,
    profile.ethicalStance,
    'market-research',
    RESEARCH_PROMPT
  );

  return chat({
    systemPrompt,
    messages: [
      {
        role: 'user',
        parts: [
          {
            text: `Research the competitive landscape for this business. Identify direct competitors, indirect competitors (alternative solutions), and analyze their positioning, pricing, channels, strengths, and weaknesses. Find gaps they're not filling.\n\nBusiness Context:\n${businessContext}`,
          },
        ],
      },
    ],
    enableSearchGrounding: true,
    temperature: 0.5,
    maxTokens: 8192,
  });
}

/**
 * Researches current market trends, emerging opportunities, and
 * cultural shifts relevant to the business using search grounding.
 */
export async function researchTrends(profile: BusinessProfile): Promise<string> {
  const businessContext = profileToContext(profile);
  const systemPrompt = buildSystemPrompt(
    businessContext,
    profile.ethicalStance,
    'market-research',
    RESEARCH_PROMPT
  );

  return chat({
    systemPrompt,
    messages: [
      {
        role: 'user',
        parts: [
          {
            text: `Research current trends, emerging opportunities, and cultural shifts relevant to this business. Classify each trend as evergreen, durable shift, hot trend, temporary fad, manufactured hype, or local opportunity. Focus on what's actionable now.\n\nBusiness Context:\n${businessContext}`,
          },
        ],
      },
    ],
    enableSearchGrounding: true,
    temperature: 0.5,
    maxTokens: 8192,
  });
}
