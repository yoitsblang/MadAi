import { chat } from '@/lib/ai/gemini';
import { buildSystemPrompt } from '@/lib/ai/prompts/general';
import { TIMING_PROMPT } from '@/lib/ai/prompts/research';
import type { BusinessProfile } from '@/lib/types/business';
import { profileToContext } from './utils';

/**
 * Analyzes timing context using search grounding for current data.
 * Evaluates seasonal patterns, news cycle, economic climate, platform
 * algorithm state, competition cycle, and cultural calendar.
 */
export async function analyzeTimingContext(profile: BusinessProfile): Promise<string> {
  const businessContext = profileToContext(profile);
  const systemPrompt = buildSystemPrompt(
    businessContext,
    profile.ethicalStance,
    'timing',
    TIMING_PROMPT
  );

  return chat({
    systemPrompt,
    messages: [
      {
        role: 'user',
        parts: [
          {
            text: `Analyze the current timing context for this business. Use live data to assess seasonal patterns, current events, economic climate, platform algorithm changes, competitor activity, and cultural calendar. Determine what to do NOW vs what to wait on, and identify optimal timing windows.\n\nBusiness Context:\n${businessContext}`,
          },
        ],
      },
    ],
    enableSearchGrounding: true,
    temperature: 0.6,
    maxTokens: 8192,
  });
}
