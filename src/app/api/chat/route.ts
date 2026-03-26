import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db';
import { INTAKE_SYSTEM_PROMPT } from '@/lib/ai/prompts/intake';
import { VALUE_DIAGNOSIS_PROMPT, BUSINESS_LOGIC_PROMPT } from '@/lib/ai/prompts/diagnosis';
import { PLATFORM_POWER_PROMPT } from '@/lib/ai/prompts/platform';
import { PSYCHOLOGY_PROMPT } from '@/lib/ai/prompts/psychology';
import { ETHICS_PROMPT } from '@/lib/ai/prompts/ethics';
import { MACRO_STRATEGY_PROMPT, MESO_STRATEGY_PROMPT, MICRO_STRATEGY_PROMPT } from '@/lib/ai/prompts/strategy';
import { RESEARCH_PROMPT, TIMING_PROMPT } from '@/lib/ai/prompts/research';
import { INNOVATION_PROMPT, TEACHING_PROMPT } from '@/lib/ai/prompts/innovation';
import { buildSystemPrompt } from '@/lib/ai/prompts/general';

import { getModelForContext } from '@/lib/ai/config';

if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is not set');
}
const genai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const MODULE_PROMPTS: Record<string, string> = {
  'intake': INTAKE_SYSTEM_PROMPT,
  'value-diagnosis': VALUE_DIAGNOSIS_PROMPT,
  'business-logic': BUSINESS_LOGIC_PROMPT,
  'platform-power': PLATFORM_POWER_PROMPT,
  'psychology': PSYCHOLOGY_PROMPT,
  'ethics': ETHICS_PROMPT,
  'strategy-macro': MACRO_STRATEGY_PROMPT,
  'strategy-meso': MESO_STRATEGY_PROMPT,
  'strategy-micro': MICRO_STRATEGY_PROMPT,
  'market-research': RESEARCH_PROMPT,
  'timing': TIMING_PROMPT,
  'innovation': INNOVATION_PROMPT,
  'teaching': TEACHING_PROMPT,
  'general': '',
};

// Modules that need live search grounding
const SEARCH_MODULES = new Set(['market-research', 'timing', 'innovation']);

// Simple in-memory rate limiter per user
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 30; // requests per window
const RATE_WINDOW = 60_000; // 1 minute

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(userId);
  if (!entry || now > entry.resetAt) {
    // Clean up expired entry before setting new one
    if (entry) rateLimitMap.delete(userId);
    rateLimitMap.set(userId, { count: 1, resetAt: now + RATE_WINDOW });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

// Periodic cleanup of expired rate limit entries to prevent memory leak
setInterval(() => {
  const now = Date.now();
  for (const [key, val] of rateLimitMap.entries()) {
    if (now > val.resetAt) rateLimitMap.delete(key);
  }
}, 5 * 60_000); // Clean every 5 minutes

interface ChatRequest {
  messages: { role: 'user' | 'assistant'; content: string }[];
  module: string;
  businessContext: string;
  ethicalStance: string;
  sessionId?: string;
}

async function loadUserMemories(userId: string): Promise<string> {
  const memories = await prisma.aiMemory.findMany({
    where: {
      userId,
      OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
    },
    orderBy: { updatedAt: 'desc' },
    take: 200, // Load ALL memories — 80+ data points across modules
  });

  if (memories.length === 0) return '';

  const grouped: Record<string, string[]> = {};
  for (const m of memories) {
    const cat = m.category || 'general';
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(`- ${m.key}: ${m.value}`);
  }

  const parts = Object.entries(grouped).map(
    ([cat, items]) => `[${cat}]\n${items.join('\n')}`
  );

  return `\n\n--- AI MEMORY (learned from prior conversations) ---\nYou have accumulated knowledge about this user's business from previous stages. USE this information proactively — reference specific details, build on prior analyses, and demonstrate continuity. Do NOT re-ask questions you already have answers to.\n\n${parts.join('\n\n')}\n--- END MEMORY ---`;
}

// Load a condensed summary of prior stage conversations for cross-stage awareness
async function loadPriorStageContext(sessionId: string, currentModule: string): Promise<string> {
  const STAGE_ORDER = ['intake', 'value-diagnosis', 'business-logic', 'platform-power',
    'strategy-macro', 'strategy-meso', 'strategy-micro'];
  const currentIdx = STAGE_ORDER.indexOf(currentModule);
  if (currentIdx <= 0) return ''; // No prior stages for intake

  const priorStages = STAGE_ORDER.slice(0, currentIdx);

  const messages = await prisma.message.findMany({
    where: {
      sessionId,
      module: { in: priorStages },
      role: 'assistant',
    },
    orderBy: { createdAt: 'asc' },
    select: { module: true, content: true },
  });

  if (messages.length === 0) return '';

  // Build condensed summaries per stage (last assistant message per stage = conclusion)
  const stageSummaries: Record<string, string> = {};
  for (const msg of messages) {
    // Keep the LAST (most complete) assistant message per stage
    stageSummaries[msg.module] = msg.content.slice(0, 2000);
  }

  const parts = Object.entries(stageSummaries).map(([stage, content]) => {
    const label = stage.replace(/-/g, ' ').toUpperCase();
    // Extract key conclusions (first 800 chars of last message)
    return `[${label} — COMPLETED]\n${content.slice(0, 800)}${content.length > 800 ? '...' : ''}`;
  });

  return `\n\n--- PRIOR STAGE RESULTS (completed analyses) ---\nThe following stages have been completed. Build on these findings — do NOT repeat work already done. Reference specific conclusions and scores from prior stages.\n\n${parts.join('\n\n')}\n--- END PRIOR STAGES ---`;
}

export async function POST(req: NextRequest) {
  try {
    // Auth check
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Rate limit
    if (!checkRateLimit(session.user.id)) {
      return NextResponse.json({ error: 'Too many requests. Please wait a moment.' }, { status: 429 });
    }

    const body: ChatRequest = await req.json();
    const { messages, module, businessContext, ethicalStance } = body;

    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: 'No messages provided' }, { status: 400 });
    }

    // Module access check (tier gating)
    const { checkModuleAccess, checkAndDeductCredits, refundCredits } = await import('@/lib/credits');
    const { CREDIT_COSTS } = await import('@/lib/tiers');

    const moduleAccess = await checkModuleAccess(session.user.id, module);
    if (!moduleAccess.allowed) {
      return NextResponse.json({
        error: 'module_locked',
        tier: moduleAccess.tier,
        module,
        message: `The ${module} module requires a higher subscription tier.`,
      }, { status: 403 });
    }

    // Credit check and deduction
    const creditCost = (body as unknown as Record<string, unknown>).purpose === 'brief' ? CREDIT_COSTS.brief : CREDIT_COSTS.chat;
    const creditResult = await checkAndDeductCredits(session.user.id, creditCost);
    if (!creditResult.allowed) {
      return NextResponse.json({
        error: 'insufficient_credits',
        credits: creditResult.currentCredits,
        tier: creditResult.tier,
        message: creditResult.error,
      }, { status: 402 });
    }

    // Sanitize message content
    const sanitizedMessages = messages.map(m => ({
      role: m.role,
      content: m.content.slice(0, 10000),
    }));

    // Load AI memories + prior stage context for full cross-stage awareness
    const memoryContext = await loadUserMemories(session.user.id);
    const priorStageContext = await loadPriorStageContext(body.sessionId || '', module);
    const modulePrompt = MODULE_PROMPTS[module] || '';
    const systemPrompt = buildSystemPrompt(businessContext, ethicalStance, module, modulePrompt) + memoryContext + priorStageContext;
    const enableSearch = SEARCH_MODULES.has(module);

    const geminiMessages = sanitizedMessages.map(m => ({
      role: m.role === 'assistant' ? 'model' as const : 'user' as const,
      parts: [{ text: m.content }],
    }));

    const tools = enableSearch ? [{ googleSearch: {} }] : undefined;

    const selectedModel = getModelForContext(module, creditResult.tier);
    const response = await genai.models.generateContent({
      model: selectedModel,
      contents: geminiMessages,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.8,
        maxOutputTokens: 8192,
        tools,
      },
    });

    const text = response.text ?? '';

    // Intelligent memory extraction from AI responses
    try {
      await extractAndSaveMemories(session.user.id, text, module, sanitizedMessages);
    } catch (memErr) {
      console.error('Memory extraction error (non-fatal):', memErr);
    }

    return NextResponse.json({ response: text, creditsRemaining: creditResult.currentCredits });
  } catch (error: unknown) {
    console.error('Chat API error:', error);
    // Refund credits on AI call failure
    try {
      const { refundCredits } = await import('@/lib/credits');
      const { CREDIT_COSTS } = await import('@/lib/tiers');
      const s = await auth();
      if (s?.user?.id) {
        await refundCredits(s.user.id, CREDIT_COSTS.chat);
      }
    } catch { /* best effort refund */ }
    return NextResponse.json({ error: 'Failed to generate response. Please try again.' }, { status: 500 });
  }
}

// Helper: upsert a single memory entry
async function saveMemory(userId: string, key: string, value: string, category: string) {
  if (!value || value.trim().length === 0) return;
  await prisma.aiMemory.upsert({
    where: { userId_key: { userId, key } },
    update: { value: value.trim(), category, updatedAt: new Date() },
    create: { userId, key, value: value.trim(), category },
  });
}

// Intelligent memory extraction - logs key business facts from conversations
async function extractAndSaveMemories(
  userId: string,
  aiResponse: string,
  module: string,
  messages: { role: string; content: string }[]
) {
  const lastUserMsg = messages.filter(m => m.role === 'user').pop()?.content || '';
  const allUserText = messages.filter(m => m.role === 'user').map(m => m.content).join('\n');

  // ── INTAKE: Business Profile Summary ─────────────────────────────────────
  if (aiResponse.includes('BUSINESS PROFILE SUMMARY') || module === 'intake') {
    const profileFields: Record<string, RegExp> = {
      business_name:    /Business(?:\s+Name)?:\s*(.+)/i,
      business_type:    /Type:\s*(.+)/i,
      business_stage:   /Stage:\s*(.+)/i,
      offering:         /Offering:\s*(.+)/i,
      price_point:      /Price Point:\s*(.+)/i,
      target_audience:  /Target Audience:\s*(.+)/i,
      core_value_prop:  /Core Value Proposition:\s*(.+)/i,
      current_traction: /Current Traction:\s*(.+)/i,
      active_channels:  /Active Channels:\s*(.+)/i,
      goal_30d:         /Goal[^:]*30[- ]?day[s]?[^:]*:\s*(.+)/i,
      goal_6m:          /Goal[^:]*6[- ]?month[s]?[^:]*:\s*(.+)/i,
      goal_1y:          /Goal[^:]*1[- ]?year[^:]*:\s*(.+)/i,
      niche:            /Niche:\s*(.+)/i,
      location:         /Location:\s*(.+)/i,
      team_size:        /Team(?: Size)?:\s*(.+)/i,
    };
    for (const [key, regex] of Object.entries(profileFields)) {
      const match = aiResponse.match(regex);
      if (match?.[1]) await saveMemory(userId, key, match[1], 'business');
    }
  }

  // ── VALUE-DIAGNOSIS: Scores & Pricing ────────────────────────────────────
  if (module === 'value-diagnosis') {
    const diagFields: Array<{ key: string; regex: RegExp }> = [
      { key: 'value_clarity_score',      regex: /Value Clarity Score[:\s]+(\d+(?:\/\d+)?)/i },
      { key: 'offer_strength',           regex: /Offer Strength[:\s]+(\w+)/i },
      { key: 'pricing_verdict',          regex: /Pricing[^:]*Verdict[:\s]+(\[?\w[\w\s]*\]?)/i },
      { key: 'pricing_recommendation',   regex: /Recommended (?:Price|Pricing)[:\s]+(.+)/i },
      { key: 'primary_bottleneck',       regex: /(?:Primary |Main )?Bottleneck[:\s]+(.+)/i },
      { key: 'value_gap',                regex: /(?:Value )?Gap[:\s]+(.+)/i },
      { key: 'top_objection',            regex: /(?:Top |Primary )?Objection[:\s]+(.+)/i },
      { key: 'positioning_statement',    regex: /Positioning Statement[:\s]+(.+)/i },
    ];
    for (const { key, regex } of diagFields) {
      const match = aiResponse.match(regex);
      if (match?.[1]) await saveMemory(userId, key, match[1], 'analysis');
    }
  }

  // ── BUSINESS-LOGIC: Unit Economics ───────────────────────────────────────
  if (module === 'business-logic') {
    const bizFields: Array<{ key: string; regex: RegExp }> = [
      { key: 'business_health_score',    regex: /Overall Health[:\s]+(\d+(?:\/\d+)?)/i },
      { key: 'cac_estimate',             regex: /CAC[:\s]+\$?([\d,.]+k?)/i },
      { key: 'ltv_estimate',             regex: /LTV[:\s]+\$?([\d,.]+k?)/i },
      { key: 'ltv_cac_ratio',            regex: /LTV:CAC[:\s]+([\d.]+)/i },
      { key: 'payback_period',           regex: /Payback Period[:\s]+([\d.]+ ?\w+)/i },
      { key: 'gross_margin',             regex: /Gross Margin[:\s]+([\d.]+%)/i },
      { key: 'break_even',               regex: /Break[-\s]?Even[:\s]+(.+)/i },
      { key: 'revenue_conservative_12m', regex: /Conservative[^:]*12[- ]?mo(?:nth)?[s]?[:\s]+\$?([\d,.]+k?)/i },
      { key: 'revenue_realistic_12m',    regex: /Realistic[^:]*12[- ]?mo(?:nth)?[s]?[:\s]+\$?([\d,.]+k?)/i },
      { key: 'revenue_optimistic_12m',   regex: /Optimistic[^:]*12[- ]?mo(?:nth)?[s]?[:\s]+\$?([\d,.]+k?)/i },
      { key: 'primary_revenue_model',    regex: /Revenue Model[:\s]+(.+)/i },
      { key: 'unit_economics_verdict',   regex: /Unit Economics[^:]*Verdict[:\s]+(\[?\w[\w\s]*\]?)/i },
    ];
    for (const { key, regex } of bizFields) {
      const match = aiResponse.match(regex);
      if (match?.[1]) await saveMemory(userId, key, match[1], 'economics');
    }
  }

  // ── PLATFORM-POWER: Sovereignty & Channels ───────────────────────────────
  if (module === 'platform-power') {
    const platformFields: Array<{ key: string; regex: RegExp }> = [
      { key: 'sovereignty_score',        regex: /Sovereignty Score[:\s]+(\d+(?:\/\d+)?)/i },
      { key: 'platform_risk_level',      regex: /Platform Risk[:\s]+(\[?\w[\w\s]*\]?)/i },
      { key: 'recommended_owned_channel',regex: /(?:Recommended |Primary )?Owned Channel[:\s]+(.+)/i },
      { key: 'top_rented_platform',      regex: /(?:Top |Primary )?Rented Platform[:\s]+(.+)/i },
      { key: 'platform_strategy_verdict',regex: /Platform Strategy[:\s]+(.+)/i },
      { key: 'audience_portability',     regex: /Audience Portability[:\s]+(\[?\w[\w\s]*\]?)/i },
    ];
    for (const { key, regex } of platformFields) {
      const match = aiResponse.match(regex);
      if (match?.[1]) await saveMemory(userId, key, match[1], 'platform');
    }
  }

  // ── PSYCHOLOGY: Drivers & Trust ──────────────────────────────────────────
  if (module === 'psychology') {
    const psychFields: Array<{ key: string; regex: RegExp }> = [
      { key: 'primary_psychological_driver', regex: /Primary(?:\s+Psychological)?\s+Driver[:\s]+(.+)/i },
      { key: 'secondary_driver',             regex: /Secondary Driver[:\s]+(.+)/i },
      { key: 'top_trust_blocker',            regex: /(?:Top |Primary )?Trust Blocker[:\s]+(.+)/i },
      { key: 'buying_trigger',               regex: /Buying Trigger[:\s]+(.+)/i },
      { key: 'identity_hook',                regex: /Identity Hook[:\s]+(.+)/i },
      { key: 'core_fear',                    regex: /Core Fear[:\s]+(.+)/i },
      { key: 'core_desire',                  regex: /Core Desire[:\s]+(.+)/i },
      { key: 'message_resonance_score',      regex: /Message Resonance[:\s]+(\d+(?:\/\d+)?)/i },
    ];
    for (const { key, regex } of psychFields) {
      const match = aiResponse.match(regex);
      if (match?.[1]) await saveMemory(userId, key, match[1], 'psychology');
    }
  }

  // ── ETHICS: Verdict ───────────────────────────────────────────────────────
  if (module === 'ethics') {
    const ethicsFields: Array<{ key: string; regex: RegExp }> = [
      { key: 'ethics_verdict',          regex: /(?:Ethics|Ethical)(?:\s+Verdict)?[:\s]+(\[?\w[\w\s]*\]?)/i },
      { key: 'ethics_rating',           regex: /(?:Ethics|Ethical) Rating[:\s]+(\d+(?:\/\d+)?)/i },
      { key: 'manipulation_risk',       regex: /Manipulation Risk[:\s]+(\[?\w[\w\s]*\]?)/i },
      { key: 'top_ethical_concern',     regex: /(?:Top |Primary )?Ethical Concern[:\s]+(.+)/i },
      { key: 'recommended_stance',      regex: /Recommended Stance[:\s]+(.+)/i },
    ];
    for (const { key, regex } of ethicsFields) {
      const match = aiResponse.match(regex);
      if (match?.[1]) await saveMemory(userId, key, match[1], 'ethics');
    }
  }

  // ── MARKET-RESEARCH: Niche Intelligence ──────────────────────────────────
  if (module === 'market-research') {
    const researchFields: Array<{ key: string; regex: RegExp }> = [
      { key: 'niche_power_score',       regex: /Niche Power Score[:\s]+(\d+(?:\/\d+|\s*\/\s*\d+)?)/i },
      { key: 'market_category',         regex: /Market Category[:\s]+(.+)/i },
      { key: 'tam_estimate',            regex: /TAM[:\s]+\$?([\d,.]+[BbMmKk]?)/i },
      { key: 'sam_estimate',            regex: /SAM[:\s]+\$?([\d,.]+[BbMmKk]?)/i },
      { key: 'som_estimate',            regex: /SOM[:\s]+\$?([\d,.]+[BbMmKk]?)/i },
      { key: 'market_trend_label',      regex: /(?:Market )?Trend[:\s]+(\[(?:EVERGREEN|DURABLE SHIFT|HOT TREND|TEMPORARY FAD|MANUFACTURED HYPE|LOCAL OPPORTUNITY)\])/i },
      { key: 'competition_level',       regex: /Competition[:\s]+(\[?\w[\w\s]*\]?)/i },
      { key: 'top_competitor',          regex: /(?:Top |Primary )?Competitor[:\s]+(.+)/i },
      { key: 'niche_entry_difficulty',  regex: /Entry (?:Difficulty|Barrier)[:\s]+(\[?\w[\w\s]*\]?)/i },
      { key: 'best_sub_niche',          regex: /Best Sub[-\s]?Niche[:\s]+(.+)/i },
    ];
    for (const { key, regex } of researchFields) {
      const match = aiResponse.match(regex);
      if (match?.[1]) await saveMemory(userId, key, match[1], 'market');
    }
  }

  // ── TIMING: Market Window ─────────────────────────────────────────────────
  if (module === 'timing') {
    const timingFields: Array<{ key: string; regex: RegExp }> = [
      { key: 'timing_verdict',          regex: /Timing Verdict[:\s]+(\[?\w[\w\s]*\]?)/i },
      { key: 'market_window',           regex: /Market Window[:\s]+(.+)/i },
      { key: 'urgency_level',           regex: /Urgency[:\s]+(\[?\w[\w\s]*\]?)/i },
      { key: 'seasonal_peak',           regex: /Seasonal Peak[:\s]+(.+)/i },
      { key: 'timing_risk',             regex: /Timing Risk[:\s]+(.+)/i },
      { key: 'best_launch_window',      regex: /Best Launch Window[:\s]+(.+)/i },
    ];
    for (const { key, regex } of timingFields) {
      const match = aiResponse.match(regex);
      if (match?.[1]) await saveMemory(userId, key, match[1], 'timing');
    }
  }

  // ── STRATEGY-MACRO: Competitive Position & Moat ──────────────────────────
  if (module === 'strategy-macro') {
    const macroFields: Array<{ key: string; regex: RegExp }> = [
      { key: 'moat_score',                  regex: /(?:Competitive )?Moat Score[:\s]+(\d+(?:\/\d+)?)/i },
      { key: 'moat_type',                   regex: /(?:Primary )?Moat Type[:\s]+(.+)/i },
      { key: 'strategic_direction',         regex: /Strategic Direction[:\s]+(.+)/i },
      { key: 'competitive_position',        regex: /Competitive Position[:\s]+(.+)/i },
      { key: 'positioning_category',        regex: /Positioning[^:]*Category[:\s]+(.+)/i },
      { key: 'primary_growth_lever',        regex: /(?:Primary )?Growth Lever[:\s]+(.+)/i },
      { key: 'competitive_advantage',       regex: /Competitive Advantage[:\s]+(.+)/i },
      { key: 'porter_threat_new_entrants',  regex: /New Entrants?[:\s]+(\d+(?:\/10)?)/i },
      { key: 'porter_buyer_power',          regex: /Buyer Power[:\s]+(\d+(?:\/10)?)/i },
      { key: 'porter_supplier_power',       regex: /Supplier Power[:\s]+(\d+(?:\/10)?)/i },
      { key: 'revenue_strategy_12m',        regex: /12[- ]?Month Revenue Strategy[:\s]+(.+)/i },
    ];
    for (const { key, regex } of macroFields) {
      const match = aiResponse.match(regex);
      if (match?.[1]) await saveMemory(userId, key, match[1], 'strategy');
    }
  }

  // ── STRATEGY-MESO: Channel & Campaign ────────────────────────────────────
  if (module === 'strategy-meso') {
    const mesoFields: Array<{ key: string; regex: RegExp }> = [
      { key: 'primary_channel',            regex: /Primary Channel[:\s]+(.+)/i },
      { key: 'secondary_channel',          regex: /Secondary Channel[:\s]+(.+)/i },
      { key: 'content_format',             regex: /Content Format[:\s]+(.+)/i },
      { key: 'posting_frequency',          regex: /Posting Frequency[:\s]+(.+)/i },
      { key: 'campaign_theme',             regex: /Campaign Theme[:\s]+(.+)/i },
      { key: 'funnel_stage_focus',         regex: /Funnel (?:Stage )?Focus[:\s]+(.+)/i },
      { key: 'lead_magnet_type',           regex: /Lead Magnet[:\s]+(.+)/i },
      { key: 'email_sequence_priority',    regex: /Email Sequence[:\s]+(.+)/i },
      { key: 'partnership_opportunity',    regex: /Partnership Opportunity[:\s]+(.+)/i },
    ];
    for (const { key, regex } of mesoFields) {
      const match = aiResponse.match(regex);
      if (match?.[1]) await saveMemory(userId, key, match[1], 'tactics');
    }
  }

  // ── STRATEGY-MICRO: Execution ─────────────────────────────────────────────
  if (module === 'strategy-micro') {
    const microFields: Array<{ key: string; regex: RegExp }> = [
      { key: 'immediate_action_1',          regex: /(?:Week 1|Day 1[^0]|Immediate)[^:]*(?:Action|Task)[^:]*1[:\s]+(.+)/i },
      { key: 'immediate_action_2',          regex: /(?:Week 1|Day 1[^0]|Immediate)[^:]*(?:Action|Task)[^:]*2[:\s]+(.+)/i },
      { key: 'sprint_goal_30d',             regex: /30[-\s]?Day (?:Sprint )?Goal[:\s]+(.+)/i },
      { key: 'milestone_90d',               regex: /90[-\s]?Day Milestone[:\s]+(.+)/i },
      { key: 'kpi_primary',                 regex: /Primary KPI[:\s]+(.+)/i },
      { key: 'kpi_secondary',               regex: /Secondary KPI[:\s]+(.+)/i },
      { key: 'first_revenue_action',        regex: /First Revenue Action[:\s]+(.+)/i },
      { key: 'quick_win',                   regex: /Quick Win[:\s]+(.+)/i },
      { key: 'execution_risk',              regex: /(?:Top |Primary )?Execution Risk[:\s]+(.+)/i },
    ];
    for (const { key, regex } of microFields) {
      const match = aiResponse.match(regex);
      if (match?.[1]) await saveMemory(userId, key, match[1], 'execution');
    }
  }

  // ── INNOVATION: Opportunities ─────────────────────────────────────────────
  if (module === 'innovation') {
    const innovFields: Array<{ key: string; regex: RegExp }> = [
      { key: 'top_innovation_opportunity',  regex: /(?:Top |#1 )?Innovation Opportunity[:\s]+(.+)/i },
      { key: 'disruption_risk',             regex: /Disruption Risk[:\s]+(.+)/i },
      { key: 'ai_leverage_opportunity',     regex: /AI (?:Leverage|Opportunity)[:\s]+(.+)/i },
      { key: 'untapped_segment',            regex: /Untapped Segment[:\s]+(.+)/i },
      { key: 'product_expansion_idea',      regex: /Product Expansion[:\s]+(.+)/i },
    ];
    for (const { key, regex } of innovFields) {
      const match = aiResponse.match(regex);
      if (match?.[1]) await saveMemory(userId, key, match[1], 'innovation');
    }
  }

  // ── UNIVERSAL: Key numbers mentioned by user (any module) ─────────────────
  const numberPatterns: Array<{ regex: RegExp; key: string; category: string }> = [
    { regex: /(\$[\d,.]+k?)\s*(?:per|\/)\s*month|\b(\$[\d,.]+k?)\s*MRR/i, key: 'revenue_monthly',     category: 'metrics' },
    { regex: /(\d{1,6})\s*(?:users|customers|subscribers|clients|buyers)/i,  key: 'user_count',         category: 'metrics' },
    { regex: /(\d+\.?\d*)\s*%\s*(?:retention)/i,                              key: 'retention_rate',     category: 'metrics' },
    { regex: /(\d+\.?\d*)\s*%\s*churn/i,                                      key: 'churn_rate',         category: 'metrics' },
    { regex: /(\d+\.?\d*)\s*%\s*(?:conversion|CVR|CR)\b/i,                   key: 'conversion_rate',    category: 'metrics' },
    { regex: /\bCAC\b[:\s]+\$?([\d,.]+k?)/i,                                  key: 'cac',                category: 'metrics' },
    { regex: /\bLTV\b[:\s]+\$?([\d,.]+k?)/i,                                  key: 'ltv',                category: 'metrics' },
    { regex: /average[^$]*(?:order|sale|ticket)[^$]*\$?([\d,.]+k?)/i,        key: 'avg_order_value',    category: 'metrics' },
    { regex: /(\d+\.?\d*)\s*%\s*(?:open rate|email open)/i,                  key: 'email_open_rate',    category: 'metrics' },
    { regex: /\b(\d{4,})\s*(?:followers?|subs)/i,                            key: 'social_followers',   category: 'metrics' },
  ];

  for (const { regex, key, category } of numberPatterns) {
    const match = lastUserMsg.match(regex) || allUserText.slice(-2000).match(regex);
    if (match) {
      const value = match[1] || match[2];
      if (value) await saveMemory(userId, key, value, category);
    }
  }

  // ── UNIVERSAL: Preferences & constraints ─────────────────────────────────
  const preferencePatterns: Array<{ regex: RegExp; key: string; category: string }> = [
    { regex: /(?:I (?:don't|won't|refuse to|hate|never|avoid)|no (?:cold|paid|spam))\s+(.{5,60})/i,                key: 'ethical_constraint',   category: 'preference' },
    { regex: /(?:my budget is|I (?:can spend|have)\s+)\$?([\d,.]+k?)\s*(?:per|a|\/)\s*(?:month|mo\b)/i,            key: 'budget_monthly',       category: 'business' },
    { regex: /(?:I (?:have|spend|can do)|available)\s+(\d+)\s*hours?\s*(?:per|a)\s*week/i,                         key: 'hours_per_week',       category: 'business' },
    { regex: /(?:I(?:'m| am) based in|located in|operating in|serving)\s+([A-Za-z ,]{3,40})/i,                     key: 'location',             category: 'business' },
    { regex: /(?:I(?:'ve| have) been (?:doing|running|operating)|in business for)\s+([\d]+ ?\w+)/i,                key: 'time_in_business',     category: 'business' },
    { regex: /(?:I (?:prefer|want to focus on|love|enjoy))\s+(.{5,60})/i,                                          key: 'personal_preference',  category: 'preference' },
    { regex: /(?:working (?:solo|alone)|it'?s just me|one[-\s]person|solopreneur)/i,                               key: 'team_size',            category: 'business' },
  ];

  for (const { regex, key, category } of preferencePatterns) {
    const match = lastUserMsg.match(regex);
    if (match) {
      const value = match[1] || 'solo';
      await saveMemory(userId, key, value, category);
    }
  }

  // ── Track which modules have been completed ────────────────────────────────
  if (aiResponse.includes('[STAGE_COMPLETE:')) {
    const stageMatch = aiResponse.match(/\[STAGE_COMPLETE:\s*([^\]]+)\]/);
    if (stageMatch?.[1]) {
      const stageKey = `stage_completed_${stageMatch[1].trim().replace(/\s+/g, '_')}`;
      await saveMemory(userId, stageKey, new Date().toISOString(), 'progress');
    }
  }
}
