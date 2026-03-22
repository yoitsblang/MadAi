import { chat } from '@/lib/ai/gemini';
import { buildSystemPrompt } from '@/lib/ai/prompts/general';
import { INTAKE_SYSTEM_PROMPT } from '@/lib/ai/prompts/intake';
import type { BusinessProfile, ChatMessage } from '@/lib/types/business';
import { profileToContext, formatMessages } from './utils';

/**
 * Runs the intake conversation engine. Builds the intake system prompt
 * with the general prompt + intake module prompt, formats messages for
 * Gemini, and returns the AI response.
 */
export async function runIntake(
  messages: ChatMessage[],
  profile: BusinessProfile
): Promise<string> {
  const businessContext = profileToContext(profile);
  const systemPrompt = buildSystemPrompt(
    businessContext,
    profile.ethicalStance,
    'intake',
    INTAKE_SYSTEM_PROMPT
  );

  const geminiMessages = formatMessages(messages);

  return chat({
    systemPrompt,
    messages: geminiMessages,
    temperature: 0.8,
    maxTokens: 4096,
  });
}

/**
 * Takes conversation history and asks AI to extract a structured BusinessProfile
 * from the information gathered during intake.
 */
export async function extractProfileFromConversation(
  messages: ChatMessage[]
): Promise<string> {
  const systemPrompt = `You are a data extraction engine. Analyze the following conversation between a business strategist and a user. Extract all business information discussed and return it as a structured JSON object matching this exact schema:

{
  "name": "string - business name",
  "description": "string - brief business description",
  "businessType": "one of: physical-product, digital-product, service, saas, creator-brand, personal-brand, agency, ecommerce, local-business, brick-and-mortar, nonprofit-with-revenue, adult-content, art-creative, coaching-consulting, food-beverage, events, marketplace, other",
  "stage": "one of: idea, pre-launch, early, growing, established, struggling, pivoting",
  "offering": "string - what they sell",
  "offeringExists": "boolean - true if product/service already exists",
  "pricePoint": "string - price or price range",
  "targetAudience": "string - who it's for",
  "audiencePain": "string - main pain point",
  "audienceDesire": "string - main desire",
  "audienceSophistication": "one of: unaware, problem-aware, solution-aware, product-aware, most-aware",
  "currentChannels": ["array of strings - current marketing channels"],
  "currentTraction": "string - current sales/followers/traction",
  "availableAssets": "string - skills, tools, content, relationships",
  "geographicScope": "string - local/regional/national/global",
  "budget": "one of: zero, minimal, moderate, substantial",
  "timeAvailable": "one of: minimal, part-time, full-time, team",
  "skillLevel": "one of: beginner, intermediate, advanced, expert",
  "contentComfort": "one of: none, low, medium, high",
  "salesComfort": "one of: none, low, medium, high",
  "techAbility": "one of: none, basic, intermediate, advanced",
  "primaryGoal": "one of: quick-cash, stable-income, brand-building, scale, experimentation, turnaround",
  "ethicalStance": "one of: ethical-first, balanced, aggressive-but-defensible, max-performance-with-warning",
  "ethicalBoundaries": "string - things they refuse to do",
  "brandPersonality": "string - tone and personality",
  "intakeComplete": "boolean - true if enough info was gathered",
  "intakeNotes": "string - any gaps or uncertainties"
}

Only include fields where information was actually discussed. For missing fields, use reasonable defaults. Return ONLY the JSON object, no other text.`;

  const geminiMessages = formatMessages(messages);

  return chat({
    systemPrompt,
    messages: geminiMessages,
    temperature: 0.3,
    maxTokens: 4096,
  });
}
