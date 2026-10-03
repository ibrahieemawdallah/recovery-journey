import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

// POST: Create a functional analysis
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { trigger, antecedent, behavior, consequence, function: func, shortTerm, longTerm, alternatives, alternative } = body;

    const ant = antecedent || trigger;

    const sessionUser = await getSessionUser(request);
    if (!sessionUser) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    if (!ant || !behavior || !consequence) {
      return NextResponse.json(
        { success: false, error: 'antecedent (or trigger), behavior, and consequence are required' },
        { status: 400 }
      );
    }

    const analysis = await prisma.functionalAnalysis.create({
      data: {
        userId: sessionUser.id,
        antecedent: ant,
        behavior,
        consequence,
        shortTerm: shortTerm || func || null,
        longTerm: longTerm || null,
        alternatives: alternatives || alternative || null,
      },
    });

    return NextResponse.json({ success: true, data: analysis }, { status: 201 });
  } catch (error) {
    console.error('FunctionalAnalysis POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create functional analysis' },
      { status: 500 }
    );
  }
}

// GET: Get functional analyses for a user
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

    const analyses = await prisma.functionalAnalysis.findMany({
      where: { userId: sessionUser.id },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });

    const total = await prisma.functionalAnalysis.count({ where: { userId: sessionUser.id } });

    return NextResponse.json({ success: true, data: analyses, total });
  } catch (error) {
    console.error('FunctionalAnalysis GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch functional analyses' },
      { status: 500 }
    );
  }
}

// PUT: Update a functional analysis
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, trigger, behavior, consequence, function: func, alternative } = body;

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

    const analysis = await prisma.functionalAnalysis.update({
      where: { id },
      data: {
        ...(trigger !== undefined && { trigger }),
        ...(behavior !== undefined && { behavior }),
        ...(consequence !== undefined && { consequence }),
        ...(func !== undefined && { function: func }),
        ...(alternative !== undefined && { alternative }),
      },
    });

    return NextResponse.json({ success: true, data: analysis });
  } catch (error) {
    console.error('FunctionalAnalysis PUT error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update functional analysis' },
      { status: 500 }
    );
  }
}

// DELETE: Delete a functional analysis
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

    await prisma.functionalAnalysis.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Functional analysis deleted' });
  } catch (error) {
    console.error('FunctionalAnalysis DELETE error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete functional analysis' },
      { status: 500 }
    );
  }
}
