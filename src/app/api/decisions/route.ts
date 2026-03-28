import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db';

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const sessionId = req.nextUrl.searchParams.get('sessionId');
  if (!sessionId) return NextResponse.json({ error: 'sessionId required' }, { status: 400 });

  const strat = await prisma.strategySession.findFirst({ where: { id: sessionId, userId: session.user.id } });
  if (!strat) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const decisions = await prisma.decision.findMany({
    where: { sessionId },
    orderBy: [{ status: 'asc' }, { updatedAt: 'desc' }],
  });

  return NextResponse.json(decisions);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { sessionId, question, tradeoffSummary, recommendation, downsideOfDelay, confidence } = body;

  if (!sessionId || !question || !tradeoffSummary || !recommendation) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const strat = await prisma.strategySession.findFirst({ where: { id: sessionId, userId: session.user.id } });
  if (!strat) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const decision = await prisma.decision.create({
    data: { sessionId, question, tradeoffSummary, recommendation, downsideOfDelay, confidence: confidence || 'medium' },
  });

  return NextResponse.json(decision);
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { id, status, decidedAction } = body;

  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  const dec = await prisma.decision.findUnique({ where: { id }, include: { session: true } });
  if (!dec || dec.session.userId !== session.user.id) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const updated = await prisma.decision.update({
    where: { id },
    data: {
      status: status || dec.status,
      decidedAction: decidedAction || dec.decidedAction,
      decidedAt: status === 'decided' ? new Date() : dec.decidedAt,
    },
  });

  return NextResponse.json(updated);
}
