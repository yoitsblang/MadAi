import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/db';

// GET /api/user - Get current user profile
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      defaultStance: true,
      onboardingDone: true,
      createdAt: true,
      _count: {
        select: {
          strategies: { where: { archived: false } },
          calendarEvents: true,
          aiMemories: true,
        },
      },
    },
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json(user);
}

// PATCH /api/user - Update user profile
export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();

  const updateData: Record<string, unknown> = {};

  if (body.name !== undefined) updateData.name = body.name;
  if (body.defaultStance !== undefined) updateData.defaultStance = body.defaultStance;
  if (body.onboardingDone !== undefined) updateData.onboardingDone = body.onboardingDone;

  if (body.newPassword) {
    if (body.newPassword.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
    }
    updateData.hashedPassword = await bcrypt.hash(body.newPassword, 12);
  }

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: updateData,
    select: {
      id: true,
      name: true,
      email: true,
      defaultStance: true,
      onboardingDone: true,
    },
  });

  return NextResponse.json(user);
}
