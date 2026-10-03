import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

// POST: Create a coping skill
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, category, effectiveness, timesUsed } = body;

    const sessionUser = await getSessionUser(request);
    if (!sessionUser) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    if (!name || !category) {
      return NextResponse.json(
        { success: false, error: 'name and category are required' },
        { status: 400 }
      );
    }

    const validCategories = ['cognitive', 'behavioral', 'physical', 'social'];
    if (!validCategories.includes(category)) {
      return NextResponse.json(
        { success: false, error: 'category must be one of: cognitive, behavioral, physical, social' },
        { status: 400 }
      );
    }

    const skill = await prisma.copingSkill.create({
      data: {
        userId: sessionUser.id,
        name,
        description: description || null,
        category,
        effectiveness: typeof effectiveness === 'number' ? effectiveness : 0,
        timesUsed: typeof timesUsed === 'number' ? timesUsed : 0,
      },
    });

    return NextResponse.json({ success: true, data: skill }, { status: 201 });
  } catch (error) {
    console.error('CopingSkills POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create coping skill' },
      { status: 500 }
    );
  }
}

// GET: Get coping skills for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    const sessionUser = await getSessionUser(request);
    if (!sessionUser) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const where: any = { userId: sessionUser.id };
    if (category) where.category = category;

    const skills = await prisma.copingSkill.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: skills });
  } catch (error) {
    console.error('CopingSkills GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch coping skills' },
      { status: 500 }
    );
  }
}

// PUT: Update a coping skill
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, description, category, timesUsed, lastUsed } = body;

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

    const skill = await prisma.copingSkill.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(category !== undefined && { category }),
        ...(timesUsed !== undefined && { timesUsed }),
        ...(lastUsed !== undefined && { lastUsed: lastUsed ? new Date(lastUsed) : null }),
      },
    });

    return NextResponse.json({ success: true, data: skill });
  } catch (error) {
    console.error('CopingSkills PUT error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update coping skill' },
      { status: 500 }
    );
  }
}

// DELETE: Delete a coping skill
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

    await prisma.copingSkill.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Coping skill deleted' });
  } catch (error) {
    console.error('CopingSkills DELETE error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete coping skill' },
      { status: 500 }
    );
  }
}
