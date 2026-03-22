import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db';
import { MODULE_INFO, ModuleType } from '@/lib/types/business';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const format = req.nextUrl.searchParams.get('format') || 'json';

  const strategySession = await prisma.strategySession.findFirst({
    where: { id, userId: session.user.id },
    include: {
      messages: { orderBy: { createdAt: 'asc' } },
    },
  });

  if (!strategySession) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 });
  }

  if (format === 'md') {
    const markdown = generateMarkdown(strategySession);
    const filename = `${sanitizeFilename(strategySession.name)}-${formatDate(strategySession.createdAt)}.md`;

    return new NextResponse(markdown, {
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  }

  // Default: JSON export
  const filename = `${sanitizeFilename(strategySession.name)}-${formatDate(strategySession.createdAt)}.json`;

  return new NextResponse(JSON.stringify(strategySession, null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}

interface SessionWithMessages {
  name: string;
  createdAt: Date;
  updatedAt: Date;
  profileJson: string | null;
  activeModule: string;
  intakeComplete: boolean;
  valueDiagnosisJson: string | null;
  healthScoreJson: string | null;
  messages: {
    role: string;
    content: string;
    module: string;
    createdAt: Date;
  }[];
}

function generateMarkdown(session: SessionWithMessages): string {
  const lines: string[] = [];
  const profile = parseJson(session.profileJson);

  // Header
  lines.push(`# ${session.name}`);
  lines.push('');
  lines.push(`**Date:** ${session.createdAt.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`);
  lines.push(`**Last Updated:** ${session.updatedAt.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`);
  lines.push('');

  // Business profile
  if (profile) {
    lines.push('## Business Profile');
    lines.push('');
    if (profile.name) lines.push(`- **Business Name:** ${profile.name}`);
    if (profile.description) lines.push(`- **Description:** ${profile.description}`);
    if (profile.businessType) lines.push(`- **Type:** ${profile.businessType}`);
    if (profile.stage) lines.push(`- **Stage:** ${profile.stage}`);
    if (profile.offering) lines.push(`- **Offering:** ${profile.offering}`);
    if (profile.targetAudience) lines.push(`- **Target Audience:** ${profile.targetAudience}`);
    if (profile.revenue) lines.push(`- **Revenue:** ${profile.revenue}`);
    if (profile.goals) lines.push(`- **Goals:** ${profile.goals}`);
    lines.push('');
  }

  // Diagnosis results
  const diagnosis = parseJson(session.valueDiagnosisJson);
  if (diagnosis) {
    lines.push('## Value Diagnosis');
    lines.push('');
    lines.push('```json');
    lines.push(JSON.stringify(diagnosis, null, 2));
    lines.push('```');
    lines.push('');
  }

  const healthScore = parseJson(session.healthScoreJson);
  if (healthScore) {
    lines.push('## Health Score');
    lines.push('');
    lines.push('```json');
    lines.push(JSON.stringify(healthScore, null, 2));
    lines.push('```');
    lines.push('');
  }

  // Messages grouped by module
  if (session.messages.length > 0) {
    lines.push('## Conversation');
    lines.push('');

    const grouped = groupByModule(session.messages);

    for (const [module, messages] of Object.entries(grouped)) {
      const info = MODULE_INFO[module as ModuleType];
      const label = info ? `${info.icon} ${info.label}` : module;

      lines.push(`### ${label}`);
      lines.push('');

      for (const msg of messages) {
        const roleLabel = msg.role === 'user' ? '**You**' : msg.role === 'assistant' ? '**MadAi**' : '**System**';
        lines.push(`${roleLabel}:`);
        lines.push('');
        lines.push(msg.content);
        lines.push('');
        lines.push('---');
        lines.push('');
      }
    }
  }

  return lines.join('\n');
}

function groupByModule(messages: { module: string; role: string; content: string; createdAt: Date }[]) {
  const groups: Record<string, typeof messages> = {};
  for (const msg of messages) {
    const key = msg.module || 'general';
    if (!groups[key]) groups[key] = [];
    groups[key].push(msg);
  }
  return groups;
}

function parseJson(value: string | null): Record<string, unknown> | null {
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9-_ ]/g, '').replace(/\s+/g, '-').toLowerCase();
}

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}
