import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

// POST: Create or update relapse plan
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { triggers, warningSigns, copingStrategies, supportContacts, reasons, reasonsForLiving } = body;

    const sessionUser = await getSessionUser(request);
    if (!sessionUser) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const data = {
      triggers: triggers ? JSON.stringify(triggers) : null,
      warningSigns: warningSigns ? JSON.stringify(warningSigns) : null,
      copingStrategies: copingStrategies ? JSON.stringify(copingStrategies) : null,
      supportContacts: supportContacts ? JSON.stringify(supportContacts) : null,
      reasons: reasons || reasonsForLiving || null,
    };

    // RelapsePlan has a unique userId, so we use upsert
    const plan = await prisma.relapsePlan.upsert({
      where: { userId: sessionUser.id },
      update: data,
      create: { userId: sessionUser.id, ...data },
    });

    return NextResponse.json({ success: true, data: plan }, { status: 201 });
  } catch (error) {
    console.error('RelapsePlan POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create/update relapse plan' },
      { status: 500 }
    );
  }
}

// GET: Get relapse plan for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const sessionUser = await getSessionUser(request);
    if (!sessionUser) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const plan = await prisma.relapsePlan.findUnique({
      where: { userId: sessionUser.id },
    });

    if (!plan) {
      return NextResponse.json(
        { success: false, error: 'No relapse plan found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: plan });
  } catch (error) {
    console.error('RelapsePlan GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch relapse plan' },
      { status: 500 }
    );
  }
}
