import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// POST /api/worktasks - Create work task
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, title, priority, dueDate } = body

    if (!userId || !title) {
      return NextResponse.json(
        { success: false, error: 'userId and title are required' },
        { status: 400 }
      )
    }

    const task = await db.workTask.create({
      data: {
        userId,
        title,
        priority: priority || 'medium',
        dueDate: dueDate ? new Date(dueDate) : null
      }
    })

    return NextResponse.json({ success: true, task })
  } catch (error) {
    console.error('Error creating work task:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create work task' },
      { status: 500 }
    )
  }
}

// GET /api/worktasks - Get work tasks for user
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'userId is required' },
        { status: 400 }
      )
    }

    const tasks = await db.workTask.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ success: true, tasks })
  } catch (error) {
    console.error('Error fetching work tasks:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch work tasks' },
      { status: 500 }
    )
  }
}

// PUT /api/worktasks - Update work task
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, completed, title, priority, dueDate } = body

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'id is required' },
        { status: 400 }
      )
    }

    const task = await db.workTask.update({
      where: { id },
      data: {
        completed: completed !== undefined ? completed : undefined,
        title: title !== undefined ? title : undefined,
        priority: priority !== undefined ? priority : undefined,
        dueDate: dueDate !== undefined ? new Date(dueDate) : undefined
      }
    })

    return NextResponse.json({ success: true, task })
  } catch (error) {
    console.error('Error updating work task:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update work task' },
      { status: 500 }
    )
  }
}

// DELETE /api/worktasks - Delete work task
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'id is required' },
        { status: 400 }
      )
    }

    await db.workTask.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting work task:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete work task' },
      { status: 500 }
    )
  }
}
