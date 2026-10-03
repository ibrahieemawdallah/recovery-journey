import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

// POST: Create or update a clinical session
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, sessionType, type, phase, title, notes, goals, therapistName, status, scheduledAt } = body;

    const st = sessionType || type;

    const sessionUser = await getSessionUser(request);
    if (!sessionUser) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    if (!st) {
      return NextResponse.json(
        { success: false, error: 'sessionType is required' },
        { status: 400 }
      );
    }

    const data = {
      sessionType: st,
      phase: phase || 'assessment',
      status: status || 'scheduled',
      notes: notes || null,
      goals: goals || title || null,
      therapistName: therapistName || null,
      ...(scheduledAt ? { scheduledAt: new Date(scheduledAt) } : {}),
    };

    let session;
    if (id) {
      session = await prisma.clinicalSession.update({ where: { id }, data });
    } else {
      session = await prisma.clinicalSession.create({ data: { userId: sessionUser.id, ...data } });
    }

    return NextResponse.json({ success: true, data: session }, { status: 201 });
  } catch (error) {
    console.error('Clinical POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create/update clinical session' },
      { status: 500 }
    );
  }
}

// GET: Get clinical sessions for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const limit = parseInt(searchParams.get('limit') || '20');

    const sessionUser = await getSessionUser(request);
    if (!sessionUser) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const where: any = { userId: sessionUser.id };
    if (type) where.sessionType = type;

    const sessions = await prisma.clinicalSession.findMany({
      where,
      orderBy: { scheduledAt: 'desc' },
      take: limit,
    });

    return NextResponse.json({ success: true, data: sessions });
  } catch (error) {
    console.error('Clinical GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch clinical sessions' },
      { status: 500 }
    );
  }
}
