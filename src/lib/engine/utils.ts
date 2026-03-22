import type { BusinessProfile, ChatMessage } from '@/lib/types/business';
import type { GeminiMessage } from '@/lib/ai/gemini';

/**
 * Converts a BusinessProfile into a readable text summary for injection into prompts.
 */
export function profileToContext(profile: BusinessProfile): string {
  if (!profile.name && !profile.description) {
    return 'Not yet established. User is in intake phase.';
  }

  const lines: string[] = [];

  // Core identity
  lines.push(`Business: ${profile.name || 'Unnamed'}`);
  lines.push(`Description: ${profile.description || 'Not provided'}`);
  lines.push(`Type: ${profile.businessType}`);
  lines.push(`Stage: ${profile.stage}`);

  // Offering
  lines.push('');
  lines.push('--- OFFERING ---');
  lines.push(`What they sell: ${profile.offering || 'Not defined yet'}`);
  lines.push(`Offering exists: ${profile.offeringExists ? 'Yes' : 'No (idea stage)'}`);
  lines.push(`Price point: ${profile.pricePoint || 'Not set'}`);

  // Audience
  lines.push('');
  lines.push('--- TARGET AUDIENCE ---');
  lines.push(`Who it's for: ${profile.targetAudience || 'Not defined'}`);
  lines.push(`Audience pain: ${profile.audiencePain || 'Not identified'}`);
  lines.push(`Audience desire: ${profile.audienceDesire || 'Not identified'}`);
  lines.push(`Audience sophistication: ${profile.audienceSophistication}`);

  // Current state
  lines.push('');
  lines.push('--- CURRENT STATE ---');
  lines.push(`Channels: ${profile.currentChannels.length > 0 ? profile.currentChannels.join(', ') : 'None'}`);
  lines.push(`Traction: ${profile.currentTraction || 'None'}`);
  lines.push(`Available assets: ${profile.availableAssets || 'None noted'}`);
  lines.push(`Geographic scope: ${profile.geographicScope || 'Not specified'}`);

  // Resources & constraints
  lines.push('');
  lines.push('--- RESOURCES & CONSTRAINTS ---');
  lines.push(`Budget: ${profile.budget}`);
  lines.push(`Time available: ${profile.timeAvailable}`);
  lines.push(`Skill level: ${profile.skillLevel}`);
  lines.push(`Content comfort: ${profile.contentComfort}`);
  lines.push(`Sales comfort: ${profile.salesComfort}`);
  lines.push(`Tech ability: ${profile.techAbility}`);

  // Goals & ethics
  lines.push('');
  lines.push('--- GOALS & ETHICS ---');
  lines.push(`Primary goal: ${profile.primaryGoal}`);
  lines.push(`Ethical stance: ${profile.ethicalStance}`);
  lines.push(`Ethical boundaries: ${profile.ethicalBoundaries || 'None specified'}`);
  lines.push(`Brand personality: ${profile.brandPersonality || 'Not defined'}`);

  // Intake status
  lines.push('');
  lines.push(`Intake complete: ${profile.intakeComplete ? 'Yes' : 'No'}`);
  if (profile.intakeNotes) {
    lines.push(`Intake notes: ${profile.intakeNotes}`);
  }

  return lines.join('\n');
}

/**
 * Converts ChatMessage[] to GeminiMessage[], filtering out system messages
 * and mapping 'assistant' role to 'model'.
 */
export function formatMessages(messages: ChatMessage[]): GeminiMessage[] {
  return messages
    .filter((m) => m.role !== 'system')
    .map((m) => ({
      role: (m.role === 'assistant' ? 'model' : 'user') as 'user' | 'model',
      parts: [{ text: m.content }],
    }));
}
