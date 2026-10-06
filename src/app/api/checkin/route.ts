import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSessionUser } from '@/lib/auth'

// POST /api/checkin - Create or update daily check-in
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { mood, energy, stress, triggers, notes } = body

    const sessionUser = await getSessionUser(request)
    if (!sessionUser) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const userId = sessionUser.id
    const today = new Date().toISOString().split('T')[0]

    // Check if check-in already exists for today
    const existing = await db.dailyCheckin.findFirst({
      where: {
        userId,
        date: {
          gte: new Date(today),
          lt: new Date(new Date(today).getTime() + 24 * 60 * 60 * 1000)
        }
      }
    })

    let checkin
    if (existing) {
      checkin = await db.dailyCheckin.update({
        where: { id: existing.id },
        data: {
          mood,
          energy: parseInt(energy),
          stress,
          triggers: Array.isArray(triggers) ? JSON.stringify(triggers) : triggers,
          notes
        }
      })
    } else {
      checkin = await db.dailyCheckin.create({
        data: {
          userId,
          mood,
          energy: parseInt(energy),
          stress,
          triggers: Array.isArray(triggers) ? JSON.stringify(triggers) : triggers,
          notes
        }
      })

      // Update user streak
      await db.user.update({
        where: { id: userId },
        data: {
          currentStreak: { increment: 1 },
          totalDays: { increment: 1 }
        }
      })
    }

    return NextResponse.json({ success: true, checkin })
  } catch (error) {
    console.error('Error creating check-in:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create check-in' },
      { status: 500 }
    )
  }
}

// GET /api/checkin - Get check-ins for user
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '30')

    const sessionUser = await getSessionUser(request)
    if (!sessionUser) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const checkins = await db.dailyCheckin.findMany({
      where: { userId: sessionUser.id },
      orderBy: { date: 'desc' },
      take: limit
    })

    // Also return the user's current step so the UI can show
    // "You are working on Step X" with tailored suggestions.
    const stepProgress = await db.stepProgress.findMany({
      where: { userId: sessionUser.id },
      orderBy: { stepNumber: 'asc' },
    })

    const currentStep = stepProgress.find((p) => p.status === 'in_progress')
    const nextStep = stepProgress.find((p) => p.status === 'not_started')

    return NextResponse.json({
      success: true,
      checkins,
      currentStep: currentStep
        ? {
            stepNumber: currentStep.stepNumber,
            status: currentStep.status,
            tasksDone: 0,
            tasksTotal: 0,
          }
        : null,
      nextStep: nextStep
        ? {
            stepNumber: nextStep.stepNumber,
            status: nextStep.status,
          }
        : null,
    })
  } catch (error) {
    console.error('Error fetching check-ins:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch check-ins' },
      { status: 500 }
    )
  }
}
