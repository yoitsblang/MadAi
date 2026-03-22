import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db';

// PATCH /api/calendar/:id - Update event
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();

  const existing = await prisma.calendarEvent.findFirst({
    where: { id, userId: session.user.id },
  });
  if (!existing) {
    return NextResponse.json({ error: 'Event not found' }, { status: 404 });
  }

  const updated = await prisma.calendarEvent.update({
    where: { id },
    data: {
      title: body.title ?? existing.title,
      description: body.description ?? existing.description,
      date: body.date ? new Date(body.date) : existing.date,
      status: body.status ?? existing.status,
      priority: body.priority ?? existing.priority,
    },
  });

  return NextResponse.json(updated);
}

// DELETE /api/calendar/:id
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  const existing = await prisma.calendarEvent.findFirst({
    where: { id, userId: session.user.id },
  });
  if (!existing) {
    return NextResponse.json({ error: 'Event not found' }, { status: 404 });
  }

  await prisma.calendarEvent.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
