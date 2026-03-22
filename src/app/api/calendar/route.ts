import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db';

// GET /api/calendar - Get calendar events
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const url = new URL(req.url);
  const startDate = url.searchParams.get('start');
  const endDate = url.searchParams.get('end');
  const status = url.searchParams.get('status');

  const where: Record<string, unknown> = { userId: session.user.id };

  if (startDate && endDate) {
    where.date = {
      gte: new Date(startDate),
      lte: new Date(endDate),
    };
  }

  if (status) {
    where.status = status;
  }

  const events = await prisma.calendarEvent.findMany({
    where,
    orderBy: { date: 'asc' },
  });

  return NextResponse.json(events);
}

// POST /api/calendar - Create calendar event
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();

  if (!body.title || !body.date) {
    return NextResponse.json({ error: 'Title and date are required' }, { status: 400 });
  }

  const event = await prisma.calendarEvent.create({
    data: {
      userId: session.user.id,
      title: body.title,
      description: body.description,
      date: new Date(body.date),
      endDate: body.endDate ? new Date(body.endDate) : null,
      type: body.type || 'custom',
      priority: body.priority || 'medium',
      module: body.module,
      sessionId: body.sessionId,
      metadata: body.metadata ? JSON.stringify(body.metadata) : null,
    },
  });

  return NextResponse.json(event, { status: 201 });
}
