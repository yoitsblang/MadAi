import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { auth } from '@/lib/auth';
import { VALUE_DIAGNOSIS_PROMPT, BUSINESS_LOGIC_PROMPT } from '@/lib/ai/prompts/diagnosis';
import { PLATFORM_POWER_PROMPT } from '@/lib/ai/prompts/platform';
import { PSYCHOLOGY_PROMPT } from '@/lib/ai/prompts/psychology';
import { MACRO_STRATEGY_PROMPT, MESO_STRATEGY_PROMPT, MICRO_STRATEGY_PROMPT } from '@/lib/ai/prompts/strategy';
import { buildSystemPrompt } from '@/lib/ai/prompts/general';

if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is not set');
}
const genai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const MODEL = 'gemini-3.1-flash-lite-preview';

type AnalysisType = 'value-diagnosis' | 'business-logic' | 'platform-power' | 'psychology' | 'strategy-macro' | 'strategy-meso' | 'strategy-micro' | 'full-diagnosis';

const ANALYSIS_PROMPTS: Record<string, string> = {
  'value-diagnosis': VALUE_DIAGNOSIS_PROMPT,
  'business-logic': BUSINESS_LOGIC_PROMPT,
  'platform-power': PLATFORM_POWER_PROMPT,
  'psychology': PSYCHOLOGY_PROMPT,
  'strategy-macro': MACRO_STRATEGY_PROMPT,
  'strategy-meso': MESO_STRATEGY_PROMPT,
  'strategy-micro': MICRO_STRATEGY_PROMPT,
};

const VALID_TYPES = new Set([...Object.keys(ANALYSIS_PROMPTS), 'full-diagnosis']);

interface AnalyzeRequest {
  analysisType: AnalysisType;
  businessContext: string;
  ethicalStance: string;
  additionalContext?: string;
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: AnalyzeRequest = await req.json();
    const { analysisType, businessContext, ethicalStance, additionalContext } = body;

    if (!analysisType || !businessContext || !ethicalStance) {
      return NextResponse.json({ error: 'analysisType, businessContext, and ethicalStance are required' }, { status: 400 });
    }

    if (!VALID_TYPES.has(analysisType)) {
      return NextResponse.json({ error: 'Invalid analysis type' }, { status: 400 });
    }

    const sanitizedContext = businessContext.slice(0, 5000);
    const sanitizedAdditional = additionalContext?.slice(0, 3000) || '';

    if (analysisType === 'full-diagnosis') {
      const results: Record<string, string> = {};

      for (const type of ['value-diagnosis', 'business-logic', 'platform-power'] as const) {
        const prompt = ANALYSIS_PROMPTS[type];
        const systemPrompt = buildSystemPrompt(sanitizedContext, ethicalStance, type, prompt);

        const response = await genai.models.generateContent({
          model: MODEL,
          contents: [{
            role: 'user',
            parts: [{ text: `Analyze this business:\n\n${sanitizedContext}${sanitizedAdditional ? '\n\nAdditional context: ' + sanitizedAdditional : ''}` }],
          }],
          config: {
            systemInstruction: systemPrompt,
            temperature: 0.7,
            maxOutputTokens: 8192,
          },
        });

        results[type] = response.text ?? '';
      }

      return NextResponse.json({ results });
    }

    const prompt = ANALYSIS_PROMPTS[analysisType];
    if (!prompt) {
      return NextResponse.json({ error: 'Invalid analysis type' }, { status: 400 });
    }

    const systemPrompt = buildSystemPrompt(sanitizedContext, ethicalStance, analysisType, prompt);

    const response = await genai.models.generateContent({
      model: MODEL,
      contents: [{
        role: 'user',
        parts: [{ text: `Analyze this business:\n\n${sanitizedContext}${sanitizedAdditional ? '\n\nAdditional context: ' + sanitizedAdditional : ''}` }],
      }],
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
        maxOutputTokens: 8192,
      },
    });

    return NextResponse.json({ response: response.text ?? '' });
  } catch (error: unknown) {
    console.error('Analyze API error:', error);
    return NextResponse.json({ error: 'Analysis failed. Please try again.' }, { status: 500 });
  }
}
