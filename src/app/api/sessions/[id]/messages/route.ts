import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db';

// POST /api/sessions/:id/messages - Add message to session
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const { role, content, module, metadata } = await req.json();

  if (!role || !content) {
    return NextResponse.json({ error: 'Role and content are required' }, { status: 400 });
  }

  // Verify ownership
  const existing = await prisma.strategySession.findFirst({
    where: { id, userId: session.user.id },
  });
  if (!existing) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 });
  }

  const message = await prisma.message.create({
    data: {
      sessionId: id,
      role,
      content,
      module: module || 'general',
      metadata: metadata ? JSON.stringify(metadata) : null,
    },
  });

  // Update session timestamp
  await prisma.strategySession.update({
    where: { id },
    data: { updatedAt: new Date() },
  });

  return NextResponse.json(message, { status: 201 });
}
