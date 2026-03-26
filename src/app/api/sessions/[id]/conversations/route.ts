import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db';

const MODULE_TITLES: Record<string, string> = {
  'intake': 'Business Intake Chat',
  'value-diagnosis': 'Value Diagnosis Chat',
  'business-logic': 'Business Logic Discussion',
  'platform-power': 'Platform Power Analysis',
  'psychology': 'Psychology Discussion',
  'ethics': 'Ethics Review',
  'strategy-macro': 'Macro Strategy Discussion',
  'strategy-meso': 'Meso Strategy Discussion',
  'strategy-micro': 'Micro Strategy Chat',
  'market-research': 'Market Research Chat',
  'timing': 'Timing Analysis',
  'innovation': 'Innovation Discussion',
  'teaching': 'Teaching Session',
  'general': 'General Discussion',
};

// GET: List all conversations for a session
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  // Verify session ownership
  const strategySession = await prisma.strategySession.findUnique({
    where: { id, userId: session.user.id },
    select: { id: true },
  });

  if (!strategySession) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 });
  }

  const conversations = await prisma.conversation.findMany({
    where: { sessionId: id },
    orderBy: { updatedAt: 'desc' },
    include: {
      _count: { select: { messages: true } },
    },
  });

  return NextResponse.json({ conversations });
}

// POST: Create a new conversation
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  // Verify session ownership
  const strategySession = await prisma.strategySession.findUnique({
    where: { id, userId: session.user.id },
    select: { id: true },
  });

  if (!strategySession) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 });
  }

  let body: { title?: string; module?: string } = {};
  try {
    body = await req.json();
  } catch {
    // Empty body is fine — defaults will apply
  }

  const module = body.module || 'general';
  const title = body.title || MODULE_TITLES[module] || 'New Conversation';

  const conversation = await prisma.conversation.create({
    data: {
      sessionId: id,
      title,
      module,
    },
    include: {
      _count: { select: { messages: true } },
    },
  });

  return NextResponse.json({ conversation }, { status: 201 });
}
