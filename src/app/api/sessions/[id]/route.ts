import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db';

// GET /api/sessions/:id - Get a specific session with messages
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  const strategySession = await prisma.strategySession.findFirst({
    where: { id, userId: session.user.id },
    include: {
      messages: { orderBy: { createdAt: 'asc' } },
    },
  });

  if (!strategySession) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 });
  }

  return NextResponse.json(strategySession);
}

// PATCH /api/sessions/:id - Update session
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();

  // Verify ownership
  const existing = await prisma.strategySession.findFirst({
    where: { id, userId: session.user.id },
  });
  if (!existing) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 });
  }

  const updated = await prisma.strategySession.update({
    where: { id },
    data: {
      name: body.name ?? existing.name,
      profileJson: body.profileJson ?? existing.profileJson,
      activeModule: body.activeModule ?? existing.activeModule,
      intakeComplete: body.intakeComplete ?? existing.intakeComplete,
      valueDiagnosisJson: body.valueDiagnosisJson ?? existing.valueDiagnosisJson,
      healthScoreJson: body.healthScoreJson ?? existing.healthScoreJson,
      platformJson: body.platformJson ?? existing.platformJson,
      strategyJson: body.strategyJson ?? existing.strategyJson,
    },
  });

  return NextResponse.json(updated);
}

// DELETE /api/sessions/:id - Archive session
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  const existing = await prisma.strategySession.findFirst({
    where: { id, userId: session.user.id },
  });
  if (!existing) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 });
  }

  await prisma.strategySession.update({
    where: { id },
    data: { archived: true },
  });

  return NextResponse.json({ success: true });
}
