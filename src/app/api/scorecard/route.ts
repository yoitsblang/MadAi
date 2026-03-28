import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db';

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const sessionId = req.nextUrl.searchParams.get('sessionId');
  if (!sessionId) return NextResponse.json({ error: 'sessionId required' }, { status: 400 });

  const scorecard = await prisma.founderScorecard.findFirst({
    where: { sessionId },
    orderBy: { generatedAt: 'desc' },
  });

  return NextResponse.json(scorecard);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { sessionId, clarity, trust, conversion, retention, delivery, channelHealth, audienceOwnership, executionSpeed, reasoning } = body;

  if (!sessionId) return NextResponse.json({ error: 'sessionId required' }, { status: 400 });

  const strat = await prisma.strategySession.findFirst({ where: { id: sessionId, userId: session.user.id } });
  if (!strat) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const scorecard = await prisma.founderScorecard.create({
    data: {
      sessionId,
      clarity: clarity || 0,
      trust: trust || 0,
      conversion: conversion || 0,
      retention: retention || 0,
      delivery: delivery || 0,
      channelHealth: channelHealth || 0,
      audienceOwnership: audienceOwnership || 0,
      executionSpeed: executionSpeed || 0,
      reasoning: reasoning ? JSON.stringify(reasoning) : null,
    },
  });

  return NextResponse.json(scorecard);
}
