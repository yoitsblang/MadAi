import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db';

// GET /api/sessions/:id/stats - Get session statistics
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  const strategySession = await prisma.strategySession.findFirst({
    where: { id, userId: session.user.id },
    include: {
      messages: {
        select: { module: true, createdAt: true, role: true, content: true, id: true },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!strategySession) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 });
  }

  // Count messages by module
  const moduleCount: Record<string, number> = {};
  for (const msg of strategySession.messages) {
    moduleCount[msg.module] = (moduleCount[msg.module] || 0) + 1;
  }

  // Unique modules visited (only count if there are messages in that module)
  const uniqueModules = Object.keys(moduleCount);

  // Days since created
  const daysSinceCreated = Math.floor(
    (Date.now() - new Date(strategySession.createdAt).getTime()) / (1000 * 60 * 60 * 24)
  );

  // Action plans linked to this session
  const actionPlans = await prisma.actionPlan.findMany({
    where: { sessionId: id, userId: session.user.id },
    include: {
      items: {
        orderBy: { sortOrder: 'asc' },
      },
    },
    orderBy: { updatedAt: 'desc' },
  });

  // AI memories for this user
  const memories = await prisma.aiMemory.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: 'desc' },
  });

  // Recent messages (last 10 non-system)
  const recentMessages = strategySession.messages
    .filter(m => m.role !== 'system')
    .slice(0, 10);

  return NextResponse.json({
    messageCount: strategySession.messages.length,
    moduleCount,
    uniqueModules,
    uniqueModuleCount: uniqueModules.length,
    daysSinceCreated,
    actionPlanCount: actionPlans.length,
    actionPlans,
    memoryCount: memories.length,
    memories,
    recentMessages,
    session: {
      id: strategySession.id,
      name: strategySession.name,
      description: strategySession.description,
      profileJson: strategySession.profileJson,
      activeModule: strategySession.activeModule,
      intakeComplete: strategySession.intakeComplete,
      healthScoreJson: strategySession.healthScoreJson,
      valueDiagnosisJson: strategySession.valueDiagnosisJson,
      createdAt: strategySession.createdAt,
      updatedAt: strategySession.updatedAt,
    },
  });
}
