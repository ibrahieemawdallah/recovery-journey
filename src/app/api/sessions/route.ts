import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET - Fetch sessions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const mentorId = searchParams.get('mentorId')
    const menteeId = searchParams.get('menteeId')
    const status = searchParams.get('status')
    const upcoming = searchParams.get('upcoming') === 'true'

    let whereClause: any = {}

    if (userId) {
      // Get sessions where user is either mentor or mentee
      whereClause.OR = [
        { mentorId: userId },
        { menteeId: userId }
      ]
    } else {
      if (mentorId) whereClause.mentorId = mentorId
      if (menteeId) whereClause.menteeId = menteeId
    }

    if (status) {
      whereClause.status = status
    }

    if (upcoming) {
      whereClause.status = 'scheduled'
      whereClause.scheduledAt = {
        gte: new Date()
      }
    }

    const sessions = await db.session.findMany({
      where: whereClause,
      include: {
        mentor: {
          select: {
            id: true,
            name: true,
            bio: true,
            averageRating: true
          }
        },
        mentee: {
          select: {
            id: true,
            name: true,
            bio: true
          }
        },
        helpRequest: {
          select: {
            id: true,
            title: true,
            category: true,
            urgency: true
          }
        }
      },
      orderBy: {
        scheduledAt: 'asc'
      }
    })

    return NextResponse.json({
      success: true,
      sessions
    })
  } catch (error) {
    console.error('Error fetching sessions:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch sessions'
    }, { status: 500 })
  }
}

// POST - Create a new session
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { helpRequestId, mentorId, menteeId, title, description, scheduledAt, duration } = body

    if (!helpRequestId || !mentorId || !menteeId || !title || !scheduledAt) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields'
      }, { status: 400 })
    }

    const session = await db.session.create({
      data: {
        helpRequestId,
        mentorId,
        menteeId,
        title,
        description: description || null,
        scheduledAt: new Date(scheduledAt),
        duration: duration || 60
      },
      include: {
        mentor: {
          select: {
            id: true,
            name: true
          }
        },
        mentee: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    // Create notifications for both parties
    await db.notification.create({
      data: {
        userId: menteeId,
        title: 'Session Scheduled',
        message: `You have a scheduled session with ${session.mentor.name} on ${new Date(scheduledAt).toLocaleDateString()}`,
        type: 'session_reminder',
        actionUrl: `/sessions/${session.id}`
      }
    })

    return NextResponse.json({
      success: true,
      session
    })
  } catch (error) {
    console.error('Error creating session:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to create session'
    }, { status: 500 })
  }
}

// PUT - Update session
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, status, notes, scheduledAt, duration } = body

    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'Missing session ID'
      }, { status: 400 })
    }

    const updateData: any = {}

    if (status) updateData.status = status
    if (notes !== undefined) updateData.notes = notes
    if (scheduledAt) updateData.scheduledAt = new Date(scheduledAt)
    if (duration) updateData.duration = duration

    const session = await db.session.update({
      where: { id },
      data: updateData,
      include: {
        mentor: {
          select: {
            id: true,
            name: true
          }
        },
        mentee: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    // Notify relevant party
    if (status === 'completed') {
      await db.notification.create({
        data: {
          userId: session.menteeId,
          title: 'Session Completed',
          message: `Your session with ${session.mentor.name} has been completed. Please leave a review.`,
          type: 'session_reminder',
          actionUrl: `/sessions/${id}`
        }
      })
    } else if (status === 'cancelled') {
      await db.notification.create({
        data: {
          userId: session.menteeId,
          title: 'Session Cancelled',
          message: `Your session has been cancelled.`,
          type: 'session_reminder',
          actionUrl: null
        }
      })
    }

    return NextResponse.json({
      success: true,
      session
    })
  } catch (error) {
    console.error('Error updating session:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to update session'
    }, { status: 500 })
  }
}

// DELETE - Delete a session
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'Missing session ID'
      }, { status: 400 })
    }

    await db.session.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Session deleted'
    })
  } catch (error) {
    console.error('Error deleting session:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to delete session'
    }, { status: 500 })
  }
}
