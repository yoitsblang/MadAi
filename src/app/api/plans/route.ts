import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db';

// GET /api/plans - List user's action plans
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const plans = await prisma.actionPlan.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: 'desc' },
    include: {
      items: {
        orderBy: { sortOrder: 'asc' },
      },
    },
  });

  return NextResponse.json(plans);
}

// POST /api/plans - Create a new action plan
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { title, description, sessionId, horizon, items } = body;

  if (!title) {
    return NextResponse.json({ error: 'Title is required' }, { status: 400 });
  }

  const plan = await prisma.actionPlan.create({
    data: {
      userId: session.user.id,
      title,
      description: description || null,
      sessionId: sessionId || null,
      horizon: horizon || '90-day',
      status: 'active',
    },
  });

  // Create items if provided
  if (items && Array.isArray(items)) {
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      await prisma.actionPlanItem.create({
        data: {
          planId: plan.id,
          title: item.title,
          description: item.description || null,
          priority: item.priority || 'medium',
          dueDate: item.dueDate ? new Date(item.dueDate) : null,
          frequency: item.frequency || 'one-time',
          category: item.category || null,
          sortOrder: i,
        },
      });
    }
  }

  const fullPlan = await prisma.actionPlan.findUnique({
    where: { id: plan.id },
    include: { items: { orderBy: { sortOrder: 'asc' } } },
  });

  return NextResponse.json(fullPlan, { status: 201 });
}
