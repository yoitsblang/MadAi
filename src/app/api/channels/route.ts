import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db';

// GET /api/channels - Latest channel snapshot per platform for authenticated user
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Get all snapshots ordered by date, then deduplicate to latest per platform
  const allSnapshots = await prisma.channelTracker.findMany({
    where: { userId: session.user.id },
    orderBy: { snapshotDate: 'desc' },
  });

  const latestByPlatform = new Map<string, typeof allSnapshots[number]>();
  for (const snapshot of allSnapshots) {
    if (!latestByPlatform.has(snapshot.platform)) {
      latestByPlatform.set(snapshot.platform, snapshot);
    }
  }

  return NextResponse.json(Array.from(latestByPlatform.values()));
}

// POST /api/channels - Create a new channel snapshot
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { platform, followers, engagement, posts, revenue, notes, sessionId } = body;

  if (!platform) {
    return NextResponse.json(
      { error: 'Missing required field: platform' },
      { status: 400 }
    );
  }

  const snapshot = await prisma.channelTracker.create({
    data: {
      userId: session.user.id,
      platform,
      followers: followers ?? null,
      engagement: engagement ?? null,
      posts: posts ?? null,
      revenue: revenue ?? null,
      notes: notes || null,
      sessionId: sessionId || null,
    },
  });

  return NextResponse.json(snapshot, { status: 201 });
}
