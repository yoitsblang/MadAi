import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db';

// GET /api/memory - Get user's AI memories
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const url = new URL(req.url);
  const category = url.searchParams.get('category');

  const where: Record<string, unknown> = { userId: session.user.id };
  if (category) where.category = category;

  // Filter out expired memories
  const memories = await prisma.aiMemory.findMany({
    where: {
      ...where,
      OR: [
        { expiresAt: null },
        { expiresAt: { gt: new Date() } },
      ],
    },
    orderBy: { updatedAt: 'desc' },
  });

  return NextResponse.json(memories);
}

// POST /api/memory - Create or update AI memory
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { key, value, category, expiresAt } = await req.json();

  if (!key || !value || !category) {
    return NextResponse.json({ error: 'Key, value, and category are required' }, { status: 400 });
  }

  const memory = await prisma.aiMemory.upsert({
    where: {
      userId_key: { userId: session.user.id, key },
    },
    update: {
      value,
      category,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
    },
    create: {
      userId: session.user.id,
      key,
      value,
      category,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
    },
  });

  return NextResponse.json(memory);
}

// DELETE /api/memory?key=xxx - Delete a memory
export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const url = new URL(req.url);
  const key = url.searchParams.get('key');

  if (!key) {
    return NextResponse.json({ error: 'Key is required' }, { status: 400 });
  }

  await prisma.aiMemory.deleteMany({
    where: { userId: session.user.id, key },
  });

  return NextResponse.json({ success: true });
}
