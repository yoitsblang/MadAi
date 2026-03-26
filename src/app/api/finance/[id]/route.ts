import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db';

const VALID_TYPES = ['revenue', 'expense', 'investment'] as const;

// PATCH /api/finance/[id] - Update a finance entry
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
  const existing = await prisma.financeEntry.findUnique({ where: { id } });
  if (!existing || existing.userId !== session.user.id) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const body = await req.json();
  const updateData: Record<string, unknown> = {};

  if (body.type !== undefined) {
    if (!VALID_TYPES.includes(body.type)) {
      return NextResponse.json(
        { error: `Invalid type. Must be one of: ${VALID_TYPES.join(', ')}` },
        { status: 400 }
      );
    }
    updateData.type = body.type;
  }
  if (body.category !== undefined) updateData.category = body.category;
  if (body.amount !== undefined) {
    if (typeof body.amount !== 'number' || body.amount <= 0) {
      return NextResponse.json(
        { error: 'Amount must be a positive number' },
        { status: 400 }
      );
    }
    updateData.amount = body.amount;
  }
  if (body.date !== undefined) updateData.date = new Date(body.date);
  if (body.description !== undefined) updateData.description = body.description;

  const updated = await prisma.financeEntry.update({
    where: { id },
    data: updateData,
  });

  return NextResponse.json(updated);
}

// DELETE /api/finance/[id] - Delete a finance entry
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
  const existing = await prisma.financeEntry.findUnique({ where: { id } });
  if (!existing || existing.userId !== session.user.id) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  await prisma.financeEntry.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
