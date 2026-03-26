import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db';

type Params = { params: Promise<{ id: string; convId: string }> };

// Verify auth + session ownership, return userId or error response
async function authorize(sessionId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }

  const strategySession = await prisma.strategySession.findUnique({
    where: { id: sessionId, userId: session.user.id },
    select: { id: true },
  });

  if (!strategySession) {
    return { error: NextResponse.json({ error: 'Session not found' }, { status: 404 }) };
  }

  return { userId: session.user.id };
}

// GET: Get a single conversation with all its messages
export async function GET(req: NextRequest, { params }: Params) {
  const { id, convId } = await params;

  const result = await authorize(id);
  if ('error' in result) return result.error;

  const conversation = await prisma.conversation.findUnique({
    where: { id: convId, sessionId: id },
    include: {
      messages: { orderBy: { createdAt: 'asc' } },
      _count: { select: { messages: true } },
    },
  });

  if (!conversation) {
    return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
  }

  return NextResponse.json({ conversation });
}

// PATCH: Update conversation title, pinned, or archived
export async function PATCH(req: NextRequest, { params }: Params) {
  const { id, convId } = await params;

  const result = await authorize(id);
  if ('error' in result) return result.error;

  // Verify conversation exists and belongs to this session
  const existing = await prisma.conversation.findUnique({
    where: { id: convId, sessionId: id },
    select: { id: true },
  });

  if (!existing) {
    return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
  }

  let body: { title?: string; pinned?: boolean; archived?: boolean } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const data: Record<string, unknown> = {};
  if (typeof body.title === 'string') data.title = body.title.slice(0, 200);
  if (typeof body.pinned === 'boolean') data.pinned = body.pinned;
  if (typeof body.archived === 'boolean') data.archived = body.archived;

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
  }

  const conversation = await prisma.conversation.update({
    where: { id: convId },
    data,
    include: {
      _count: { select: { messages: true } },
    },
  });

  return NextResponse.json({ conversation });
}

// DELETE: Delete conversation and its messages
export async function DELETE(req: NextRequest, { params }: Params) {
  const { id, convId } = await params;

  const result = await authorize(id);
  if ('error' in result) return result.error;

  const { searchParams } = new URL(req.url);
  if (searchParams.get('confirm') !== 'true') {
    return NextResponse.json(
      { error: 'Deletion requires ?confirm=true query parameter' },
      { status: 400 }
    );
  }

  // Verify conversation exists and belongs to this session
  const existing = await prisma.conversation.findUnique({
    where: { id: convId, sessionId: id },
    select: { id: true },
  });

  if (!existing) {
    return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
  }

  // Delete messages first, then conversation
  await prisma.message.deleteMany({ where: { conversationId: convId } });
  await prisma.conversation.delete({ where: { id: convId } });

  return NextResponse.json({ success: true });
}
