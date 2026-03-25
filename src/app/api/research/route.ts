import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { auth } from '@/lib/auth';
import { RESEARCH_PROMPT } from '@/lib/ai/prompts/research';

if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is not set');
}
const genai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const MODEL = 'gemini-3.1-flash-lite-preview';

interface ResearchRequest {
  query: string;
  businessContext: string;
  researchType: 'competitors' | 'trends' | 'audience' | 'channels' | 'pricing' | 'general';
}

const VALID_TYPES = new Set(['competitors', 'trends', 'audience', 'channels', 'pricing', 'general']);

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: ResearchRequest = await req.json();
    const { query, businessContext, researchType } = body;

    if (!query || !businessContext) {
      return NextResponse.json({ error: 'Query and businessContext are required' }, { status: 400 });
    }

    if (!VALID_TYPES.has(researchType)) {
      return NextResponse.json({ error: 'Invalid research type' }, { status: 400 });
    }

    // Credit check and deduction (research costs more — uses search grounding)
    const { checkAndDeductCredits } = await import('@/lib/credits');
    const { CREDIT_COSTS } = await import('@/lib/tiers');
    const creditResult = await checkAndDeductCredits(session.user.id, CREDIT_COSTS.research);
    if (!creditResult.allowed) {
      return NextResponse.json({
        error: 'insufficient_credits',
        credits: creditResult.currentCredits,
        tier: creditResult.tier,
        message: creditResult.error,
      }, { status: 402 });
    }

    const sanitizedQuery = query.slice(0, 5000);
    const sanitizedContext = businessContext.slice(0, 5000);

    const systemPrompt = `${RESEARCH_PROMPT}\n\nBusiness Context:\n${sanitizedContext}\n\nResearch Focus: ${researchType}`;

    const response = await genai.models.generateContent({
      model: MODEL,
      contents: [{ role: 'user', parts: [{ text: sanitizedQuery }] }],
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.5,
        maxOutputTokens: 8192,
        tools: [{ googleSearch: {} }],
      },
    });

    return NextResponse.json({ response: response.text ?? '' });
  } catch (error: unknown) {
    console.error('Research API error:', error);
    return NextResponse.json({ error: 'Research request failed. Please try again.' }, { status: 500 });
  }
}
