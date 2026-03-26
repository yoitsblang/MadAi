import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db';

const VALID_TYPES = ['revenue', 'expense', 'investment'] as const;

// GET /api/finance - List finance entries for authenticated user
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const entries = await prisma.financeEntry.findMany({
    where: { userId: session.user.id },
    orderBy: { date: 'desc' },
    take: 100,
  });

  return NextResponse.json(entries);
}

// POST /api/finance - Create a new finance entry
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { type, category, amount, date, description, sessionId } = body;

  // Validate required fields
  if (!type || !category || amount === undefined || !date) {
    return NextResponse.json(
      { error: 'Missing required fields: type, category, amount, date' },
      { status: 400 }
    );
  }

  // Validate type
  if (!VALID_TYPES.includes(type)) {
    return NextResponse.json(
      { error: `Invalid type. Must be one of: ${VALID_TYPES.join(', ')}` },
      { status: 400 }
    );
  }

  // Validate amount
  if (typeof amount !== 'number' || amount <= 0) {
    return NextResponse.json(
      { error: 'Amount must be a positive number' },
      { status: 400 }
    );
  }

  const entry = await prisma.financeEntry.create({
    data: {
      userId: session.user.id,
      type,
      category,
      amount,
      date: new Date(date),
      description: description || null,
      sessionId: sessionId || null,
    },
  });

  return NextResponse.json(entry, { status: 201 });
}
