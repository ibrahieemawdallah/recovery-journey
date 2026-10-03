import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET - Fetch help requests (can filter by user, status, etc.)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const status = searchParams.get('status')
    const category = searchParams.get('category')
    const urgency = searchParams.get('urgency')
    const available = searchParams.get('available') === 'true'

    let whereClause: any = {}

    if (userId) {
      // Get requests where user is either requester or helper
      whereClause.OR = [
        { requesterId: userId },
        { helperId: userId }
      ]
    }

    if (status) {
      whereClause.status = status
    }

    if (category) {
      whereClause.category = category
    }

    if (urgency) {
      whereClause.urgency = urgency
    }

    // If looking for available help requests (helpers browsing)
    if (available && !userId) {
      whereClause.status = 'pending'
    }

    const helpRequests = await db.helpRequest.findMany({
      where: whereClause,
      include: {
        requester: {
          select: {
            id: true,
            name: true,
            bio: true,
            averageRating: true,
            totalRatings: true
          }
        },
        helper: {
          select: {
            id: true,
            name: true,
            bio: true,
            averageRating: true,
            totalRatings: true
          }
        },
        sessions: {
          where: { status: 'scheduled' },
          orderBy: { scheduledAt: 'asc' },
          take: 1
        }
      },
      orderBy: [
        { urgency: 'desc' },
        { createdAt: 'asc' }
      ]
    })

    return NextResponse.json({
      success: true,
      helpRequests
    })
  } catch (error) {
    console.error('Error fetching help requests:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch help requests'
    }, { status: 500 })
  }
}

// POST - Create a new help request
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { requesterId, title, description, category, urgency, location } = body

    if (!requesterId || !title || !description || !category) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields'
      }, { status: 400 })
    }

    const helpRequest = await db.helpRequest.create({
      data: {
        requesterId,
        title,
        description,
        category,
        urgency: urgency || 'medium',
        location: location || null
      },
      include: {
        requester: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      helpRequest
    })
  } catch (error) {
    console.error('Error creating help request:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to create help request'
    }, { status: 500 })
  }
}

// PUT - Update help request (accept, complete, etc.)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, helperId, status, notes } = body

    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'Missing help request ID'
      }, { status: 400 })
    }

    const updateData: any = { status }

    if (helperId) {
      updateData.helperId = helperId
    }

    if (notes !== undefined) {
      updateData.notes = notes
    }

    const helpRequest = await db.helpRequest.update({
      where: { id },
      data: updateData,
      include: {
        requester: {
          select: {
            id: true,
            name: true
          }
        },
        helper: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    // Create notification for the other party
    if (status === 'accepted' && helperId) {
      await db.notification.create({
        data: {
          userId: helpRequest.requesterId,
          title: 'Help Request Accepted',
          message: `Your help request "${helpRequest.title}" has been accepted!`,
          type: 'help_request',
          actionUrl: `/help-requests/${id}`
        }
      })
    } else if (status === 'completed') {
      await db.notification.create({
        data: {
          userId: helpRequest.helperId || helpRequest.requesterId,
          title: 'Help Request Completed',
          message: `Help request "${helpRequest.title}" has been completed.`,
          type: 'help_request',
          actionUrl: `/help-requests/${id}`
        }
      })
    }

    return NextResponse.json({
      success: true,
      helpRequest
    })
  } catch (error) {
    console.error('Error updating help request:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to update help request'
    }, { status: 500 })
  }
}

// DELETE - Delete a help request
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'Missing help request ID'
      }, { status: 400 })
    }

    await db.helpRequest.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Help request deleted'
    })
  } catch (error) {
    console.error('Error deleting help request:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to delete help request'
    }, { status: 500 })
  }
}
