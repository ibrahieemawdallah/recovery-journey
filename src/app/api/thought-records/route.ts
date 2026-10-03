import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

// POST: Create a thought record
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { situation, automaticThought, emotion, emotionIntensity, evidence, alternative, outcome } = body;

    const sessionUser = await getSessionUser(request);
    if (!sessionUser) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    if (!situation || !automaticThought || !emotion || !emotionIntensity) {
      return NextResponse.json(
        { success: false, error: 'situation, automaticThought, emotion, and emotionIntensity are required' },
        { status: 400 }
      );
    }

    const record = await prisma.thoughtRecord.create({
      data: {
        userId: sessionUser.id,
        situation,
        automaticThought,
        emotion,
        emotionIntensity,
        evidence: evidence || null,
        alternative: alternative || null,
        outcome: outcome || null,
      },
    });

    return NextResponse.json({ success: true, data: record }, { status: 201 });
  } catch (error) {
    console.error('ThoughtRecords POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create thought record' },
      { status: 500 }
    );
  }
}

// GET: Get thought records for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    const sessionUser = await getSessionUser(request);
    if (!sessionUser) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const records = await prisma.thoughtRecord.findMany({
      where: { userId: sessionUser.id },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });

    const total = await prisma.thoughtRecord.count({ where: { userId: sessionUser.id } });

    return NextResponse.json({ success: true, data: records, total });
  } catch (error) {
    console.error('ThoughtRecords GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch thought records' },
      { status: 500 }
    );
  }
}

// PUT: Update a thought record
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, situation, automaticThought, emotion, emotionIntensity, evidence, alternative, outcome } = body;

    const sessionUser = await getSessionUser(request);
    if (!sessionUser) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'id is required' },
        { status: 400 }
      );
    }

    const record = await prisma.thoughtRecord.update({
      where: { id },
      data: {
        ...(situation !== undefined && { situation }),
        ...(automaticThought !== undefined && { automaticThought }),
        ...(emotion !== undefined && { emotion }),
        ...(emotionIntensity !== undefined && { emotionIntensity }),
        ...(evidence !== undefined && { evidence }),
        ...(alternative !== undefined && { alternative }),
        ...(outcome !== undefined && { outcome }),
      },
    });

    return NextResponse.json({ success: true, data: record });
  } catch (error) {
    console.error('ThoughtRecords PUT error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update thought record' },
      { status: 500 }
    );
  }
}

// DELETE: Delete a thought record
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    const sessionUser = await getSessionUser(request);
    if (!sessionUser) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'id is required' },
        { status: 400 }
      );
    }

    await prisma.thoughtRecord.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Thought record deleted' });
  } catch (error) {
    console.error('ThoughtRecords DELETE error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete thought record' },
      { status: 500 }
    );
  }
}
