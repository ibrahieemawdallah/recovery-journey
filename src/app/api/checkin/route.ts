import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSessionUser } from '@/lib/auth'
import { TWELVE_STEPS_CONTENT } from '@/lib/steps-content'

// POST /api/checkin - Create or update daily check-in
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { mood, energy, stress, triggers, notes, stepNumber } = body

    const sessionUser = await getSessionUser(request)
    if (!sessionUser) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const userId = sessionUser.id
    const today = new Date().toISOString().split('T')[0]

    // The dashboard's quick check-in sends no mood/energy/stress, but the
    // schema requires them — fall back to neutral defaults.
    const moodValue = typeof mood === 'string' && mood ? mood : 'calm'
    const energyValue = Number.isFinite(parseInt(energy)) ? parseInt(energy) : 5
    const stressValue = typeof stress === 'string' && stress ? stress : 'low'

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
          mood: moodValue,
          energy: energyValue,
          stress: stressValue,
          triggers: Array.isArray(triggers) ? JSON.stringify(triggers) : triggers,
          notes
        }
      })
    } else {
      checkin = await db.dailyCheckin.create({
        data: {
          userId,
          mood: moodValue,
          energy: energyValue,
          stress: stressValue,
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

    // If a stepNumber was provided, move the user there and sync
    if (stepNumber != null) {
      const n = Number(stepNumber)
      if (Number.isInteger(n) && n >= 1 && n <= 12) {
        await db.stepProgress.upsert({
          where: { userId_stepNumber: { userId, stepNumber: n } },
          create: {
            userId,
            stepNumber: n,
            status: 'in_progress',
            tasks: {
              create: TWELVE_STEPS_CONTENT.find((s) => s.number === n)?.howToWork.en.map((t, i) => ({ taskIndex: i, title: t })) ?? []
            }
          },
          update: { status: 'in_progress', lastWorkedAt: new Date() }
        })
      }
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

    // Current step: the one that is in_progress (or the one user most recently worked)
    const stepProgress = await db.stepProgress.findMany({
      where: { userId: sessionUser.id },
      orderBy: { lastWorkedAt: 'desc' },
    })
    const currentStep = stepProgress.find((p) => p.status === 'in_progress') ?? stepProgress[0] ?? null

    let currentStepInfo: {
      stepNumber: number
      status: string
      tasksDone: number
      tasksTotal: number
    } | null = null
    if (currentStep) {
      const tasks = await db.stepTask.count({ where: { userId: sessionUser.id, stepNumber: currentStep.stepNumber, done: true } })
      const total = await db.stepTask.count({ where: { userId: sessionUser.id, stepNumber: currentStep.stepNumber } })
      currentStepInfo = {
        stepNumber: currentStep.stepNumber,
        status: currentStep.status,
        tasksDone: tasks,
        tasksTotal: total,
      }
    }

    const nextStep = stepProgress.find((p) => p.status === 'not_started') ?? null

    return NextResponse.json({
      success: true,
      checkins,
      currentStep: currentStepInfo,
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
