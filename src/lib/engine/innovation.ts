import { chat } from '@/lib/ai/gemini';
import { buildSystemPrompt } from '@/lib/ai/prompts/general';
import { INNOVATION_PROMPT } from '@/lib/ai/prompts/innovation';
import type { BusinessProfile } from '@/lib/types/business';
import { profileToContext } from './utils';

/**
 * Generates novel, non-obvious strategies through cross-industry transfer,
 * hybrid strategy generation, unusual monetization models, cultural
 * contradiction exploitation, and unserved combination detection.
 */
export async function generateInnovation(
  profile: BusinessProfile,
  diagnosis: string,
  existingStrategy?: string
): Promise<string> {
  const businessContext = profileToContext(profile);
  const systemPrompt = buildSystemPrompt(
    businessContext,
    profile.ethicalStance,
    'innovation',
    INNOVATION_PROMPT
  );

  const strategySection = existingStrategy
    ? `\n\n--- EXISTING STRATEGY (innovate beyond this) ---\n${existingStrategy}`
    : '';

  return chat({
    systemPrompt,
    messages: [
      {
        role: 'user',
        parts: [
          {
            text: `Generate an Innovation Report for this business. Cross-pollinate ideas from other industries, create hybrid strategies, propose unusual monetization angles, identify cultural tensions to exploit, and find unserved gaps. Include one genuine wildcard idea.\n\nBusiness Context:\n${businessContext}\n\n--- VALUE DIAGNOSIS ---\n${diagnosis}${strategySection}`,
          },
        ],
      },
    ],
    temperature: 1.0,
    maxTokens: 8192,
  });
}
