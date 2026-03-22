import { chat } from '@/lib/ai/gemini';
import { buildSystemPrompt } from '@/lib/ai/prompts/general';
import { ETHICS_PROMPT } from '@/lib/ai/prompts/ethics';
import type { BusinessProfile } from '@/lib/types/business';
import { profileToContext } from './utils';

/**
 * Evaluates a specific tactic through the dual lens of effectiveness
 * and legitimacy, respecting the user's chosen ethical stance.
 */
export async function evaluateEthics(
  tactic: string,
  profile: BusinessProfile
): Promise<string> {
  const businessContext = profileToContext(profile);
  const systemPrompt = buildSystemPrompt(
    businessContext,
    profile.ethicalStance,
    'ethics',
    ETHICS_PROMPT
  );

  return chat({
    systemPrompt,
    messages: [
      {
        role: 'user',
        parts: [
          {
            text: `Evaluate the following tactic through the Ethical Exchange framework. Score effectiveness and legitimacy, give a verdict, explain tradeoffs, and provide a higher-road alternative if applicable.\n\nEthical stance: ${profile.ethicalStance}\n\nTactic to evaluate:\n${tactic}\n\nBusiness Context:\n${businessContext}`,
          },
        ],
      },
    ],
    temperature: 0.6,
    maxTokens: 4096,
  });
}

/**
 * Evaluates a full strategy (multiple tactics/approaches) through the
 * ethical exchange framework.
 */
export async function evaluateStrategy(
  strategy: string,
  profile: BusinessProfile
): Promise<string> {
  const businessContext = profileToContext(profile);
  const systemPrompt = buildSystemPrompt(
    businessContext,
    profile.ethicalStance,
    'ethics',
    ETHICS_PROMPT
  );

  return chat({
    systemPrompt,
    messages: [
      {
        role: 'user',
        parts: [
          {
            text: `Evaluate the following complete strategy through the Ethical Exchange framework. For each major component, score effectiveness and legitimacy, give verdicts, and provide an overall ethical assessment with recommendations.\n\nEthical stance: ${profile.ethicalStance}\n\nStrategy to evaluate:\n${strategy}\n\nBusiness Context:\n${businessContext}`,
          },
        ],
      },
    ],
    temperature: 0.6,
    maxTokens: 8192,
  });
}
