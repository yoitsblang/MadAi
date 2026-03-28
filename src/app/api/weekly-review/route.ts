import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db';

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const sessionId = req.nextUrl.searchParams.get('sessionId');
  if (!sessionId) return NextResponse.json({ error: 'sessionId required' }, { status: 400 });

  const reviews = await prisma.weeklyReview.findMany({
    where: { sessionId },
    orderBy: { weekOf: 'desc' },
    take: 10,
  });

  return NextResponse.json(reviews);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { sessionId, improved, stalled, completed, newBottleneck, bestNextMove, notes } = body;

  if (!sessionId) return NextResponse.json({ error: 'sessionId required' }, { status: 400 });

  const strat = await prisma.strategySession.findFirst({ where: { id: sessionId, userId: session.user.id } });
  if (!strat) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  // Get start of current week (Monday)
  const now = new Date();
  const dayOfWeek = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
  monday.setHours(0, 0, 0, 0);

  const review = await prisma.weeklyReview.create({
    data: {
      sessionId,
      weekOf: monday,
      improved: JSON.stringify(improved || []),
      stalled: JSON.stringify(stalled || []),
      completed: JSON.stringify(completed || []),
      newBottleneck,
      bestNextMove,
      notes,
    },
  });

  return NextResponse.json(review);
}
