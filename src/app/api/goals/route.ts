import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSessionUser } from '@/lib/auth'

// POST /api/goals - Create daily goal
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, priority, date } = body

    const sessionUser = await getSessionUser(request)
    if (!sessionUser) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    if (!title) {
      return NextResponse.json(
        { success: false, error: 'Title is required' },
        { status: 400 }
      )
    }

    const goal = await db.dailyGoal.create({
      data: {
        userId: sessionUser.id,
        title,
        priority: priority || 'medium',
        date: date ? new Date(date) : new Date()
      }
    })

    return NextResponse.json({ success: true, goal })
  } catch (error) {
    console.error('Error creating goal:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create goal' },
      { status: 500 }
    )
  }
}

// GET /api/goals - Get goals for user
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const date = searchParams.get('date')

    const sessionUser = await getSessionUser(request)
    if (!sessionUser) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const where: any = { userId: sessionUser.id }
    if (date) {
      const targetDate = new Date(date)
      where.date = {
        gte: new Date(targetDate.toISOString().split('T')[0]),
        lt: new Date(new Date(targetDate).getTime() + 24 * 60 * 60 * 1000)
      }
    }

    const goals = await db.dailyGoal.findMany({
      where,
      orderBy: { date: 'desc' }
    })

    return NextResponse.json({ success: true, goals })
  } catch (error) {
    console.error('Error fetching goals:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch goals' },
      { status: 500 }
    )
  }
}

// PUT /api/goals - Update goal
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, completed, title, priority } = body

    const sessionUser = await getSessionUser(request)
    if (!sessionUser) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'id is required' },
        { status: 400 }
      )
    }

    const goal = await db.dailyGoal.update({
      where: { id },
      data: {
        completed: completed !== undefined ? completed : undefined,
        title: title !== undefined ? title : undefined,
        priority: priority !== undefined ? priority : undefined
      }
    })

    return NextResponse.json({ success: true, goal })
  } catch (error) {
    console.error('Error updating goal:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update goal' },
      { status: 500 }
    )
  }
}

// DELETE /api/goals - Delete goal
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')

    const sessionUser = await getSessionUser(request)
    if (!sessionUser) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'id is required' },
        { status: 400 }
      )
    }

    await db.dailyGoal.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting goal:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete goal' },
      { status: 500 }
    )
  }
}
