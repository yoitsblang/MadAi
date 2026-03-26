import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db';

// PATCH /api/channels/[id] - Update a channel snapshot
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  // Ownership check
  const existing = await prisma.channelTracker.findUnique({ where: { id } });
  if (!existing || existing.userId !== session.user.id) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const body = await req.json();
  const updateData: Record<string, unknown> = {};

  if (body.platform !== undefined) updateData.platform = body.platform;
  if (body.followers !== undefined) updateData.followers = body.followers;
  if (body.engagement !== undefined) updateData.engagement = body.engagement;
  if (body.posts !== undefined) updateData.posts = body.posts;
  if (body.revenue !== undefined) updateData.revenue = body.revenue;
  if (body.notes !== undefined) updateData.notes = body.notes;

  const updated = await prisma.channelTracker.update({
    where: { id },
    data: updateData,
  });

  return NextResponse.json(updated);
}

// DELETE /api/channels/[id] - Delete a channel snapshot
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const { searchParams } = new URL(req.url);

  // Soft check: require confirm=true
  if (searchParams.get('confirm') !== 'true') {
    return NextResponse.json(
      { error: 'Deletion requires ?confirm=true query parameter' },
      { status: 400 }
    );
  }

  // Ownership check
  const existing = await prisma.channelTracker.findUnique({ where: { id } });
  if (!existing || existing.userId !== session.user.id) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  await prisma.channelTracker.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
