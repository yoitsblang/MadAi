import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  const strategySession = await prisma.strategySession.findUnique({
    where: { id, userId: session.user.id },
    include: {
      messages: { orderBy: { createdAt: 'asc' } },
    },
  });

  if (!strategySession) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 });
  }

  // Load AI memories
  const memories = await prisma.aiMemory.findMany({
    where: {
      userId: session.user.id,
      OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
    },
    orderBy: { updatedAt: 'desc' },
  });

  // Load action plans for this session
  const plans = await prisma.actionPlan.findMany({
    where: { userId: session.user.id, sessionId: id },
    include: { items: { orderBy: { sortOrder: 'asc' } } },
    orderBy: { updatedAt: 'desc' },
  });

  // Load calendar events
  const calendarEvents = await prisma.calendarEvent.findMany({
    where: { userId: session.user.id, sessionId: id },
    orderBy: { date: 'asc' },
    take: 20,
  });

  // Parse profile
  let profile: Record<string, unknown> = {};
  try { profile = JSON.parse(strategySession.profileJson || '{}'); } catch { /* ignore */ }

  // Compute pipeline completion
  const STAGE_FLOW = ['intake', 'value-diagnosis', 'business-logic', 'platform-power',
    'strategy-macro', 'strategy-meso', 'strategy-micro'];
  const completedStages = STAGE_FLOW.filter(stage => {
    if (stage === 'intake') return strategySession.intakeComplete;
    return strategySession.messages.some(m =>
      m.role === 'assistant' && m.content.includes(`[STAGE_COMPLETE: ${stage}]`)
    );
  });

  // Extract key metrics from memories
  const memoryMap: Record<string, string> = {};
  for (const m of memories) {
    memoryMap[m.key] = m.value;
  }

  const metrics = {
    businessName: memoryMap.business_name || profile.name as string || strategySession.name || 'My Business',
    businessType: memoryMap.business_type || profile.businessType as string || '',
    offering: memoryMap.offering || profile.offering as string || '',
    targetAudience: memoryMap.target_audience || profile.targetAudience as string || '',
    revenueMonthly: memoryMap.revenue_monthly || '',
    avgOrderValue: memoryMap.avg_order_value || '',
    valueClarityScore: memoryMap.value_clarity_score || '',
    businessHealthScore: memoryMap.business_health_score || '',
    sovereigntyScore: memoryMap.sovereignty_score || '',
    moatScore: memoryMap.moat_score || '',
    goal30d: memoryMap.goal_30d || '',
    goal6m: memoryMap.goal_6m || '',
    goal1y: memoryMap.goal_1y || '',
    pricePoint: memoryMap.price_point || profile.pricePoint as string || '',
    activeChannels: memoryMap.active_channels || '',
    primaryBottleneck: memoryMap.primary_bottleneck || '',
    coreValueProp: memoryMap.core_value_prop || '',
  };

  // Plan progress
  const planStats = plans.length > 0 ? {
    totalItems: plans[0].items.length,
    completedItems: plans[0].items.filter(i => i.status === 'completed').length,
    inProgressItems: plans[0].items.filter(i => i.status === 'in_progress').length,
  } : null;

  return NextResponse.json({
    session: {
      id: strategySession.id,
      name: strategySession.name,
      activeModule: strategySession.activeModule,
      intakeComplete: strategySession.intakeComplete,
      createdAt: strategySession.createdAt,
      updatedAt: strategySession.updatedAt,
    },
    profile,
    metrics,
    pipeline: {
      stages: STAGE_FLOW,
      completed: completedStages,
      total: STAGE_FLOW.length,
      percentage: Math.round((completedStages.length / STAGE_FLOW.length) * 100),
    },
    plans,
    planStats,
    calendarEvents,
    memories: memories.map(m => ({ key: m.key, value: m.value, category: m.category })),
  });
}
