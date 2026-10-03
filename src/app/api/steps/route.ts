import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSessionUser } from '@/lib/auth'

// POST /api/steps - Update step progress
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { stepNumber, completed, notes } = body

    const sessionUser = await getSessionUser(request)
    if (!sessionUser) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    if (stepNumber === undefined) {
      return NextResponse.json(
        { success: false, error: 'stepNumber is required' },
        { status: 400 }
      )
    }

    // Check if step progress already exists
    const existing = await db.stepProgress.findUnique({
      where: {
        userId_stepNumber: {
          userId: sessionUser.id,
          stepNumber
        }
      }
    })

    let progress
    if (existing) {
      // Update existing progress
      progress = await db.stepProgress.update({
        where: {
          userId_stepNumber: {
            userId,
            stepNumber
          }
        },
        data: {
          completed: completed !== undefined ? completed : existing.completed,
          completedAt: completed && !existing.completed ? new Date() : existing.completedAt,
          notes: notes !== undefined ? notes : existing.notes
        }
      })
    } else {
      // Create new progress
      progress = await db.stepProgress.create({
        data: {
          userId,
          stepNumber,
          completed: completed || false,
          notes
        }
      })
    }

    return NextResponse.json({ success: true, progress })
  } catch (error) {
    console.error('Error updating step progress:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update step progress' },
      { status: 500 }
    )
  }
}

// GET /api/steps - Get step progress for user
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams

    const sessionUser = await getSessionUser(request)
    if (!sessionUser) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const progress = await db.stepProgress.findMany({
      where: { userId: sessionUser.id },
      orderBy: { stepNumber: 'asc' }
    })

    return NextResponse.json({ success: true, progress })
  } catch (error) {
    console.error('Error fetching step progress:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch step progress' },
      { status: 500 }
    )
  }
}
