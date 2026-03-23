import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db';

// GET /api/plans/[id] - Get a specific plan
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const plan = await prisma.actionPlan.findFirst({
    where: { id, userId: session.user.id },
    include: { items: { orderBy: { sortOrder: 'asc' } } },
  });

  if (!plan) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json(plan);
}

// PATCH /api/plans/[id] - Update a plan or its items
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const plan = await prisma.actionPlan.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!plan) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const body = await req.json();

  // Update plan fields
  if (body.title || body.description !== undefined || body.status || body.metricsJson || body.planJson) {
    await prisma.actionPlan.update({
      where: { id },
      data: {
        ...(body.title && { title: body.title }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.status && { status: body.status }),
        ...(body.metricsJson && { metricsJson: body.metricsJson }),
        ...(body.planJson && { planJson: body.planJson }),
      },
    });
  }

  // Update a specific item
  if (body.itemId && body.itemUpdate) {
    const item = await prisma.actionPlanItem.findFirst({
      where: { id: body.itemId, planId: id },
    });
    if (item) {
      await prisma.actionPlanItem.update({
        where: { id: body.itemId },
        data: {
          ...(body.itemUpdate.status && { status: body.itemUpdate.status }),
          ...(body.itemUpdate.notes !== undefined && { notes: body.itemUpdate.notes }),
          ...(body.itemUpdate.status === 'completed' && { completedAt: new Date() }),
        },
      });
    }
  }

  // Add new items
  if (body.newItems && Array.isArray(body.newItems)) {
    const maxOrder = await prisma.actionPlanItem.findFirst({
      where: { planId: id },
      orderBy: { sortOrder: 'desc' },
    });
    let order = (maxOrder?.sortOrder || 0) + 1;

    for (const item of body.newItems) {
      await prisma.actionPlanItem.create({
        data: {
          planId: id,
          title: item.title,
          description: item.description || null,
          priority: item.priority || 'medium',
          dueDate: item.dueDate ? new Date(item.dueDate) : null,
          frequency: item.frequency || 'one-time',
          category: item.category || null,
          sortOrder: order++,
        },
      });
    }
  }

  const updated = await prisma.actionPlan.findUnique({
    where: { id },
    include: { items: { orderBy: { sortOrder: 'asc' } } },
  });

  return NextResponse.json(updated);
}

// DELETE /api/plans/[id] - Delete a plan
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  await prisma.actionPlan.deleteMany({
    where: { id, userId: session.user.id },
  });

  return NextResponse.json({ ok: true });
}
