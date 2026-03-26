import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db';

// GET /api/sessions - List user's strategy sessions
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const sessions = await prisma.strategySession.findMany({
    where: { userId: session.user.id, archived: false },
    orderBy: { updatedAt: 'desc' },
    include: {
      _count: { select: { messages: true } },
    },
  });

  return NextResponse.json(sessions);
}

// POST /api/sessions - Create new strategy session
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Enforce session limits based on subscription tier
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { subscriptionTier: true, role: true, email: true },
  });
  if (user && user.role !== 'admin' && user.email !== 'bslang97@gmail.com') {
    const { canCreateSession, getSessionLimitMessage } = await import('@/lib/gating');
    const existingCount = await prisma.strategySession.count({
      where: { userId: session.user.id, archived: false },
    });
    if (!canCreateSession(user.subscriptionTier, existingCount)) {
      return NextResponse.json({
        error: 'session_limit',
        message: getSessionLimitMessage(user.subscriptionTier),
      }, { status: 403 });
    }
  }

  const body = await req.json().catch(() => ({}));

  const newSession = await prisma.strategySession.create({
    data: {
      userId: session.user.id,
      name: body.name || 'Untitled Business',
      profileJson: JSON.stringify(body.profile || {}),
    },
  });

  // Log activity
  await prisma.activityLog.create({
    data: {
      userId: session.user.id,
      action: 'session_created',
      sessionId: newSession.id,
    },
  });

  return NextResponse.json(newSession, { status: 201 });
}
