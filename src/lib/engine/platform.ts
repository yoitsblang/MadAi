import { chat } from '@/lib/ai/gemini';
import { buildSystemPrompt } from '@/lib/ai/prompts/general';
import { PLATFORM_POWER_PROMPT } from '@/lib/ai/prompts/platform';
import type { BusinessProfile } from '@/lib/types/business';
import { profileToContext } from './utils';

/**
 * Generates a platform power analysis evaluating platform dependency,
 * algorithmic gatekeeping, rent extraction, and sovereignty strategies.
 */
export async function runPlatformAnalysis(profile: BusinessProfile): Promise<string> {
  const businessContext = profileToContext(profile);
  const systemPrompt = buildSystemPrompt(
    businessContext,
    profile.ethicalStance,
    'platform-power',
    PLATFORM_POWER_PROMPT
  );

  return chat({
    systemPrompt,
    messages: [
      {
        role: 'user',
        parts: [
          {
            text: `Conduct a full Platform & Power Analysis for this business. Map platform dependencies, assess owned vs rented demand, analyze rent extraction, evaluate AI/LLM visibility risk, and recommend sovereignty strategies.\n\nBusiness Context:\n${businessContext}`,
          },
        ],
      },
    ],
    temperature: 0.7,
    maxTokens: 8192,
  });
}
