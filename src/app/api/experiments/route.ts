import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db';

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const sessionId = req.nextUrl.searchParams.get('sessionId');
  if (!sessionId) return NextResponse.json({ error: 'sessionId required' }, { status: 400 });

  // Verify ownership
  const strat = await prisma.strategySession.findFirst({ where: { id: sessionId, userId: session.user.id } });
  if (!strat) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  let experiments: unknown[] = [];
  try {
    experiments = await prisma.experiment.findMany({
      where: { sessionId },
      orderBy: { updatedAt: 'desc' },
    });
  } catch { /* table may not exist in production yet */ }

  return NextResponse.json(experiments);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { sessionId, hypothesis, change, metric, passCondition, failCondition, winAction, duration, priority } = body;

  if (!sessionId || !hypothesis || !change || !metric || !passCondition || !failCondition) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const strat = await prisma.strategySession.findFirst({ where: { id: sessionId, userId: session.user.id } });
  if (!strat) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  try {
    const experiment = await prisma.experiment.create({
      data: { sessionId, hypothesis, change, metric, passCondition, failCondition, winAction: winAction || '', duration, priority: priority || 'medium' },
    });
    return NextResponse.json(experiment);
  } catch (e) {
    console.error('Experiment create error:', e);
    return NextResponse.json({ error: 'Failed to create experiment. Database table may not be ready.' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { id, status, verdict, results } = body;

  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  const exp = await prisma.experiment.findUnique({ where: { id }, include: { session: true } });
  if (!exp || exp.session.userId !== session.user.id) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const updateData: Record<string, unknown> = {};
  if (status) updateData.status = status;
  if (verdict) updateData.verdict = verdict;
  if (results) updateData.results = results;
  if (status === 'running') updateData.deadline = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const updated = await prisma.experiment.update({ where: { id }, data: updateData });
  return NextResponse.json(updated);
}
