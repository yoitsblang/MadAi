import { chat } from '@/lib/ai/gemini';
import { buildSystemPrompt } from '@/lib/ai/prompts/general';
import { PSYCHOLOGY_PROMPT } from '@/lib/ai/prompts/psychology';
import type { BusinessProfile } from '@/lib/types/business';
import { profileToContext } from './utils';

/**
 * Generates an audience psychology profile modeling deep psychological
 * drivers, desire maps, fear/risk maps, identity dynamics, and trust barriers.
 */
export async function runPsychologyAnalysis(profile: BusinessProfile): Promise<string> {
  const businessContext = profileToContext(profile);
  const systemPrompt = buildSystemPrompt(
    businessContext,
    profile.ethicalStance,
    'psychology',
    PSYCHOLOGY_PROMPT
  );

  return chat({
    systemPrompt,
    messages: [
      {
        role: 'user',
        parts: [
          {
            text: `Build a complete Psychological Profile for this business's target audience. Model core psychological drivers, desire maps, fear/risk maps, identity and status dynamics, trust barriers, and provide messaging implications with ethical flags.\n\nBusiness Context:\n${businessContext}`,
          },
        ],
      },
    ],
    temperature: 0.8,
    maxTokens: 8192,
  });
}
