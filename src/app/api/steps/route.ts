import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSessionUser } from '@/lib/auth'
import { TWELVE_STEPS_CONTENT } from '@/lib/steps-content'

/**
 * The step-work API.
 *
 * GET  /api/steps            -> every step with status, task counts, summary
 * GET  /api/steps?step=4     -> one step, fully hydrated (tasks/reflections/worksheets)
 * POST /api/steps            -> { action, ... } mutations (see the switch below)
 *
 * All state is keyed on the session user; the client never supplies a userId.
 */

/** Ensure a StepProgress row exists, seeding its tasks from canonical content. */
async function ensureProgress(userId: string, stepNumber: number) {
  const step = TWELVE_STEPS_CONTENT.find((s) => s.number === stepNumber)
  if (!step) throw new Error(`Unknown step ${stepNumber}`)

  const existing = await db.stepProgress.findUnique({
    where: { userId_stepNumber: { userId, stepNumber } },
  })
  if (existing) return existing

  // Seed one task per "how to work it" line so the step arrives actionable.
  // The nested create must NOT carry userId/stepNumber — the relation supplies
  // them, and Prisma rejects the duplicates as unknown arguments.
  const tasks = step.howToWork.en.map((title, i) => ({
    taskIndex: i,
    title,
  }))

  return db.stepProgress.create({
    data: {
      userId,
      stepNumber,
      status: 'not_started',
      tasks: { create: tasks },
    },
  })
}

/** Recompute a step's status from its tasks, and persist the transition. */
async function syncStatus(userId: string, stepNumber: number) {
  const tasks = await db.stepTask.findMany({ where: { userId, stepNumber } })
  const done = tasks.filter((t) => t.done).length

  const progress = await db.stepProgress.findUnique({
    where: { userId_stepNumber: { userId, stepNumber } },
  })
  if (!progress) return null

  let status: string
  if (progress.completed) status = 'completed'
  else if (done === 0 && !progress.startedAt) status = 'not_started'
  else status = 'in_progress'

  const data: Record<string, unknown> = { status, lastWorkedAt: new Date() }
  if (status === 'in_progress' && !progress.startedAt) data.startedAt = new Date()

  return db.stepProgress.update({
    where: { userId_stepNumber: { userId, stepNumber } },
    data,
    include: {
      tasks: { orderBy: { taskIndex: 'asc' } },
      reflections: { orderBy: { createdAt: 'desc' } },
      worksheets: true,
    },
  })
}

const fullInclude = {
  tasks: { orderBy: { taskIndex: 'asc' as const } },
  reflections: { orderBy: { createdAt: 'desc' as const } },
  worksheets: true,
}

export async function GET(request: NextRequest) {
  try {
    const user = await getSessionUser(request)
    if (!user) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 })
    }

    const stepParam = request.nextUrl.searchParams.get('step')

    if (stepParam) {
      const n = Number(stepParam)
      if (!Number.isInteger(n) || n < 1 || n > 12) {
        return NextResponse.json({ success: false, error: 'step must be 1-12' }, { status: 400 })
      }
      await ensureProgress(user.id, n)
      const full = await db.stepProgress.findUnique({
        where: { userId_stepNumber: { userId: user.id, stepNumber: n } },
        include: fullInclude,
      })
      return NextResponse.json({ success: true, step: n, progress: full })
    }

    // Whole-programme view: every step's status + task counts.
    const all = await db.stepProgress.findMany({
      where: { userId: user.id },
      include: { tasks: true },
      orderBy: { stepNumber: 'asc' },
    })

    const byNumber = new Map(all.map((p) => [p.stepNumber, p]))
    const steps = TWELVE_STEPS_CONTENT.map((s) => {
      const p = byNumber.get(s.number)
      const total = p?.tasks.length ?? 0
      const done = p?.tasks.filter((t) => t.done).length ?? 0
      return {
        stepNumber: s.number,
        status: p?.status ?? 'not_started',
        completed: p?.completed ?? false,
        completedAt: p?.completedAt ?? null,
        startedAt: p?.startedAt ?? null,
        lastWorkedAt: p?.lastWorkedAt ?? null,
        tasksDone: done,
        tasksTotal: total,
      }
    })

    const completedCount = steps.filter((s) => s.completed).length
    const inProgress = steps.filter((s) => s.status === 'in_progress')

    return NextResponse.json({
      success: true,
      steps,
      summary: {
        completed: completedCount,
        inProgress: inProgress.length,
        nextStep: steps.find((s) => !s.completed)?.stepNumber ?? null,
        percent: Math.round((completedCount / 12) * 100),
      },
    })
  } catch (error) {
    console.error('Error fetching step progress:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch step progress' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getSessionUser(request)
    if (!user) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 })
    }

    const body = await request.json()
    const { action, stepNumber } = body

    const n = Number(stepNumber)
    if (!Number.isInteger(n) || n < 1 || n > 12) {
      return NextResponse.json({ success: false, error: 'stepNumber must be 1-12' }, { status: 400 })
    }

    await ensureProgress(user.id, n)

    switch (action) {
      case 'toggleTask': {
        const { taskIndex } = body
        const task = await db.stepTask.findUnique({
          where: {
            userId_stepNumber_taskIndex: { userId: user.id, stepNumber: n, taskIndex: Number(taskIndex) },
          },
        })
        if (!task) {
          return NextResponse.json({ success: false, error: 'Task not found' }, { status: 404 })
        }
        const nextDone = !task.done
        await db.stepTask.update({
          where: { id: task.id },
          data: { done: nextDone, doneAt: nextDone ? new Date() : null },
        })
        break
      }

      case 'taskNote': {
        const { taskIndex, note } = body
        await db.stepTask.update({
          where: {
            userId_stepNumber_taskIndex: { userId: user.id, stepNumber: n, taskIndex: Number(taskIndex) },
          },
          data: { note },
        })
        break
      }

      case 'addTask': {
        const { title } = body
        if (!title?.trim()) {
          return NextResponse.json({ success: false, error: 'title is required' }, { status: 400 })
        }
        const max = await db.stepTask.aggregate({
          where: { userId: user.id, stepNumber: n },
          _max: { taskIndex: true },
        })
        await db.stepTask.create({
          data: {
            userId: user.id,
            stepNumber: n,
            taskIndex: (max._max.taskIndex ?? -1) + 1,
            title: String(title).trim(),
          },
        })
        break
      }

      case 'deleteTask': {
        const { taskIndex } = body
        await db.stepTask.deleteMany({
          where: { userId: user.id, stepNumber: n, taskIndex: Number(taskIndex) },
        })
        break
      }

      case 'setComplete': {
        const { completed } = body
        const now = new Date()
        await db.stepProgress.update({
          where: { userId_stepNumber: { userId: user.id, stepNumber: n } },
          data: {
            completed: !!completed,
            completedAt: completed ? now : null,
            status: completed ? 'completed' : 'in_progress',
            lastWorkedAt: now,
          },
        })
        break
      }

      case 'setDoneDefinition': {
        const { doneDefinition } = body
        await db.stepProgress.update({
          where: { userId_stepNumber: { userId: user.id, stepNumber: n } },
          data: { doneDefinition, lastWorkedAt: new Date() },
        })
        break
      }

      case 'addReflection': {
        const { body: text, clarity } = body
        if (!text?.trim()) {
          return NextResponse.json({ success: false, error: 'Reflection body is required' }, { status: 400 })
        }
        await db.stepReflection.create({
          data: {
            userId: user.id,
            stepNumber: n,
            body: String(text).trim(),
            clarity: clarity ? Number(clarity) : null,
          },
        })
        await db.stepProgress.update({
          where: { userId_stepNumber: { userId: user.id, stepNumber: n } },
          data: { lastWorkedAt: new Date() },
        })
        break
      }

      case 'deleteReflection': {
        const { reflectionId } = body
        await db.stepReflection.deleteMany({ where: { id: reflectionId, userId: user.id } })
        break
      }

      case 'saveWorksheet': {
        const { kind, rows } = body
        if (!kind) {
          return NextResponse.json({ success: false, error: 'kind is required' }, { status: 400 })
        }
        const payload = JSON.stringify(Array.isArray(rows) ? rows : [])
        await db.stepWorksheet.upsert({
          where: { userId_stepNumber_kind: { userId: user.id, stepNumber: n, kind: String(kind) } },
          create: { userId: user.id, stepNumber: n, kind: String(kind), rows: payload },
          update: { rows: payload },
        })
        await db.stepProgress.update({
          where: { userId_stepNumber: { userId: user.id, stepNumber: n } },
          data: { lastWorkedAt: new Date() },
        })
        break
      }

      // Legacy shape, kept so an older client keeps working.
      case undefined: {
        const { completed, notes } = body
        await db.stepProgress.update({
          where: { userId_stepNumber: { userId: user.id, stepNumber: n } },
          data: {
            ...(completed !== undefined ? { completed, completedAt: completed ? new Date() : null } : {}),
            ...(notes !== undefined ? { notes } : {}),
            lastWorkedAt: new Date(),
          },
        })
        break
      }

      default:
        return NextResponse.json({ success: false, error: `Unknown action: ${action}` }, { status: 400 })
    }

    const updated = await syncStatus(user.id, n)
    return NextResponse.json({ success: true, progress: updated })
  } catch (error) {
    console.error('Error updating step progress:', error)
    return NextResponse.json({ success: false, error: 'Failed to update step progress' }, { status: 500 })
  }
}
