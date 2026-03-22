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

if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is not set');
}
const genai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const MODEL = 'gemini-3.1-flash-lite-preview';

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
    rateLimitMap.set(userId, { count: 1, resetAt: now + RATE_WINDOW });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

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
    take: 20,
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

  return `\n\n--- AI MEMORY (learned from prior conversations) ---\n${parts.join('\n\n')}\n--- END MEMORY ---`;
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

    // Sanitize message content
    const sanitizedMessages = messages.map(m => ({
      role: m.role,
      content: m.content.slice(0, 10000),
    }));

    // Load AI memories and inject into system prompt
    const memoryContext = await loadUserMemories(session.user.id);
    const modulePrompt = MODULE_PROMPTS[module] || '';
    const systemPrompt = buildSystemPrompt(businessContext, ethicalStance, module, modulePrompt) + memoryContext;
    const enableSearch = SEARCH_MODULES.has(module);

    const geminiMessages = sanitizedMessages.map(m => ({
      role: m.role === 'assistant' ? 'model' as const : 'user' as const,
      parts: [{ text: m.content }],
    }));

    const tools = enableSearch ? [{ googleSearch: {} }] : undefined;

    const response = await genai.models.generateContent({
      model: MODEL,
      contents: geminiMessages,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.8,
        maxOutputTokens: 8192,
        tools,
      },
    });

    const text = response.text ?? '';

    // Auto-extract memories from AI responses (key facts about the business)
    if (module === 'intake' && text.includes('BUSINESS PROFILE SUMMARY')) {
      const nameMatch = text.match(/Business:\s*(.+)/);
      if (nameMatch) {
        await prisma.aiMemory.upsert({
          where: { userId_key: { userId: session.user.id, key: 'business_name' } },
          update: { value: nameMatch[1].trim(), category: 'business' },
          create: { userId: session.user.id, key: 'business_name', value: nameMatch[1].trim(), category: 'business' },
        });
      }
    }

    return NextResponse.json({ response: text });
  } catch (error: unknown) {
    console.error('Chat API error:', error);
    return NextResponse.json({ error: 'Failed to generate response. Please try again.' }, { status: 500 });
  }
}
