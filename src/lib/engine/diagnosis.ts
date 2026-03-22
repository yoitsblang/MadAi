import { chat } from '@/lib/ai/gemini';
import { buildSystemPrompt } from '@/lib/ai/prompts/general';
import { VALUE_DIAGNOSIS_PROMPT, BUSINESS_LOGIC_PROMPT } from '@/lib/ai/prompts/diagnosis';
import type { BusinessProfile } from '@/lib/types/business';
import { profileToContext } from './utils';

/**
 * Generates a complete value diagnosis analyzing what value the business
 * creates and whether it's communicated effectively.
 */
export async function runValueDiagnosis(profile: BusinessProfile): Promise<string> {
  const businessContext = profileToContext(profile);
  const systemPrompt = buildSystemPrompt(
    businessContext,
    profile.ethicalStance,
    'value-diagnosis',
    VALUE_DIAGNOSIS_PROMPT
  );

  return chat({
    systemPrompt,
    messages: [
      {
        role: 'user',
        parts: [
          {
            text: `Conduct a full value diagnosis for this business. Analyze the value being created, how it's communicated, pricing context, hidden opportunities, and the weakest link in the value proposition.\n\nBusiness Context:\n${businessContext}`,
          },
        ],
      },
    ],
    temperature: 0.7,
    maxTokens: 8192,
  });
}

/**
 * Generates a business health scorecard using Kaufman's 5-part framework:
 * Value Creation, Marketing, Sales, Value Delivery, Finance.
 */
export async function runBusinessLogic(profile: BusinessProfile): Promise<string> {
  const businessContext = profileToContext(profile);
  const systemPrompt = buildSystemPrompt(
    businessContext,
    profile.ethicalStance,
    'business-logic',
    BUSINESS_LOGIC_PROMPT
  );

  return chat({
    systemPrompt,
    messages: [
      {
        role: 'user',
        parts: [
          {
            text: `Produce a complete Business Health Scorecard for this business. Score each of the 5 areas (Value Creation, Marketing, Sales, Value Delivery, Finance), identify the primary bottleneck, and provide specific recommendations.\n\nBusiness Context:\n${businessContext}`,
          },
        ],
      },
    ],
    temperature: 0.7,
    maxTokens: 8192,
  });
}
