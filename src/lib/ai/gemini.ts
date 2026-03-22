import { GoogleGenAI, Type } from '@google/genai';

const genai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

const MODEL = 'gemini-3.1-flash-lite-preview';

export interface GeminiMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export interface GeminiOptions {
  systemPrompt: string;
  messages: GeminiMessage[];
  enableSearchGrounding?: boolean;
  temperature?: number;
  maxTokens?: number;
}

export async function chat(options: GeminiOptions): Promise<string> {
  const {
    systemPrompt,
    messages,
    enableSearchGrounding = false,
    temperature = 0.8,
    maxTokens = 8192,
  } = options;

  const tools = enableSearchGrounding
    ? [{ googleSearch: {} }]
    : undefined;

  const response = await genai.models.generateContent({
    model: MODEL,
    contents: messages.map(m => ({
      role: m.role,
      parts: m.parts,
    })),
    config: {
      systemInstruction: systemPrompt,
      temperature,
      maxOutputTokens: maxTokens,
      tools,
    },
  });

  return response.text ?? '';
}

export async function chatStream(options: GeminiOptions) {
  const {
    systemPrompt,
    messages,
    enableSearchGrounding = false,
    temperature = 0.8,
    maxTokens = 8192,
  } = options;

  const tools = enableSearchGrounding
    ? [{ googleSearch: {} }]
    : undefined;

  const response = await genai.models.generateContentStream({
    model: MODEL,
    contents: messages.map(m => ({
      role: m.role,
      parts: m.parts,
    })),
    config: {
      systemInstruction: systemPrompt,
      temperature,
      maxOutputTokens: maxTokens,
      tools,
    },
  });

  return response;
}

export async function research(query: string, context: string): Promise<string> {
  const systemPrompt = `You are a market research analyst. Research the following query using current, real-world data.
Be specific, cite sources when possible, distinguish between evergreen truths, temporary trends, and manufactured hype.
Context about the business: ${context}`;

  return chat({
    systemPrompt,
    messages: [{ role: 'user', parts: [{ text: query }] }],
    enableSearchGrounding: true,
    temperature: 0.5,
    maxTokens: 8192,
  });
}

export function toGeminiMessages(messages: { role: 'user' | 'assistant'; content: string }[]): GeminiMessage[] {
  return messages.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));
}
