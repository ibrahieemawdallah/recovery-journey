import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSessionUser } from '@/lib/auth'

// GET - Fetch notifications for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const unreadOnly = searchParams.get('unreadOnly') === 'true'
    const type = searchParams.get('type')

    const sessionUser = await getSessionUser(request)
    if (!sessionUser) {
      return NextResponse.json({
        success: false,
        error: 'Not authenticated'
      }, { status: 401 })
    }

    let whereClause: any = { userId: sessionUser.id }

    if (unreadOnly) {
      whereClause.read = false
    }

    if (type) {
      whereClause.type = type
    }

    const notifications = await db.notification.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'desc'
      },
      take: 50 // Limit to last 50 notifications
    })

    // Count unread
    const unreadCount = await db.notification.count({
      where: {
        userId: sessionUser.id,
        read: false
      }
    })

    return NextResponse.json({
      success: true,
      notifications,
      unreadCount
    })
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch notifications'
    }, { status: 500 })
  }
}

// POST - Create a new notification
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, message, type, actionUrl } = body

    const sessionUser = await getSessionUser(request)
    if (!sessionUser) {
      return NextResponse.json({
        success: false,
        error: 'Not authenticated'
      }, { status: 401 })
    }

    if (!title || !message) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields'
      }, { status: 400 })
    }

    const notification = await db.notification.create({
      data: {
        userId: sessionUser.id,
        title,
        message,
        type: type || 'general',
        actionUrl: actionUrl || null
      }
    })

    return NextResponse.json({
      success: true,
      notification
    })
  } catch (error) {
    console.error('Error creating notification:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to create notification'
    }, { status: 500 })
  }
}

// PUT - Mark notification(s) as read
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, markAll } = body

    const sessionUser = await getSessionUser(request)
    if (!sessionUser) {
      return NextResponse.json({
        success: false,
        error: 'Not authenticated'
      }, { status: 401 })
    }

    if (markAll) {
      // Mark all notifications for user as read
      await db.notification.updateMany({
        where: {
          userId: sessionUser.id,
          read: false
        },
        data: {
          read: true
        }
      })

      return NextResponse.json({
        success: true,
        message: 'All notifications marked as read'
      })
    } else if (id) {
      // Mark specific notification as read
      await db.notification.update({
        where: { id },
        data: {
          read: true
        }
      })

      return NextResponse.json({
        success: true,
        message: 'Notification marked as read'
      })
    } else {
      return NextResponse.json({
        success: false,
        error: 'Missing notification ID or markAll flag'
      }, { status: 400 })
    }
  } catch (error) {
    console.error('Error updating notification:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to update notification'
    }, { status: 500 })
  }
}

// DELETE - Delete notification(s)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const all = searchParams.get('all') === 'true'

    const sessionUser = await getSessionUser(request)
    if (!sessionUser) {
      return NextResponse.json({
        success: false,
        error: 'Not authenticated'
      }, { status: 401 })
    }

    if (all) {
      // Delete all notifications for user
      await db.notification.deleteMany({
        where: { userId: sessionUser.id }
      })

      return NextResponse.json({
        success: true,
        message: 'All notifications deleted'
      })
    } else if (id) {
      // Delete specific notification
      await db.notification.delete({
        where: { id }
      })

      return NextResponse.json({
        success: true,
        message: 'Notification deleted'
      })
    } else {
      return NextResponse.json({
        success: false,
        error: 'Missing notification ID or all flag'
      }, { status: 400 })
    }
  } catch (error) {
    console.error('Error deleting notification:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to delete notification'
    }, { status: 500 })
  }
}
