import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

// POST: Create a risk assessment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { riskType, severity, riskLevel, score, factors, notes } = body;

    const level = severity || riskLevel;

    const sessionUser = await getSessionUser(request);
    if (!sessionUser) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    if (!level) {
      return NextResponse.json(
        { success: false, error: 'severity is required' },
        { status: 400 }
      );
    }

    const validLevels = ['low', 'moderate', 'medium', 'high', 'severe', 'critical'];
    if (!validLevels.includes(level)) {
      return NextResponse.json(
        { success: false, error: 'severity must be one of: low, moderate, high, severe, critical' },
        { status: 400 }
      );
    }

    const assessment = await prisma.riskAssessment.create({
      data: {
        userId: sessionUser.id,
        riskType: riskType || 'relapse',
        severity: level,
        score: typeof score === 'number' ? score : 0,
        factors: factors ? JSON.stringify(factors) : null,
        notes: notes || null,
      },
    });

    return NextResponse.json({ success: true, data: assessment }, { status: 201 });
  } catch (error) {
    console.error('Risk POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create risk assessment' },
      { status: 500 }
    );
  }
}

// GET: Get risk assessment history for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '30');

    const sessionUser = await getSessionUser(request);
    if (!sessionUser) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const assessments = await prisma.riskAssessment.findMany({
      where: { userId: sessionUser.id },
      orderBy: { assessedAt: 'desc' },
      take: limit,
    });

    return NextResponse.json({ success: true, data: assessments });
  } catch (error) {
    console.error('Risk GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch risk history' },
      { status: 500 }
    );
  }
}
