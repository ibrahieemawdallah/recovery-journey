import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Helper function to calculate match score
function calculateMatchScore(
  helpRequest: any,
  helper: any,
  preferences: any
): number {
  let score = 0
  const maxScore = 100

  // 1. Availability (40 points)
  if (helper.isAvailable) {
    score += 40
  }

  // 2. Rating (30 points) - 0-5 scale
  score += (helper.averageRating / 5) * 30

  // 3. Skills matching (20 points)
  if (helper.skills && helpRequest.category) {
    const skills = JSON.parse(helper.skills)
    if (skills.includes(helpRequest.category) || skills.includes('general')) {
      score += 20
    } else if (skills.length > 0) {
      // Partial match based on skill count
      score += 10
    }
  }

  // 4. Location proximity (10 points)
  if (helper.location && helpRequest.location) {
    // Simple string match for now - in production, use geolocation
    if (helper.location === helpRequest.location) {
      score += 10
    } else if (helper.location.includes(helpRequest.location) ||
               helpRequest.location.includes(helper.location)) {
      score += 5
    }
  }

  return Math.min(score, maxScore)
}

// GET - Get matched helpers for a help request
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const helpRequestId = searchParams.get('helpRequestId')
    const limit = parseInt(searchParams.get('limit') || '5')

    if (!helpRequestId) {
      return NextResponse.json({
        success: false,
        error: 'Missing helpRequestId parameter'
      }, { status: 400 })
    }

    // Get the help request
    const helpRequest = await db.helpRequest.findUnique({
      where: { id: helpRequestId },
      include: {
        requester: {
          select: {
            id: true,
            preferences: true
          }
        }
      }
    })

    if (!helpRequest) {
      return NextResponse.json({
        success: false,
        error: 'Help request not found'
      }, { status: 404 })
    }

    // Parse requester preferences
    const preferences = helpRequest.requester.preferences
      ? JSON.parse(helpRequest.requester.preferences)
      : {}

    // Get available helpers (exclude requester)
    const potentialHelpers = await db.user.findMany({
      where: {
        id: {
          not: helpRequest.requesterId
        },
        email: {
          not: null
        }
      },
      select: {
        id: true,
        name: true,
        bio: true,
        skills: true,
        location: true,
        isAvailable: true,
        averageRating: true,
        totalRatings: true
      }
    })

    // Calculate match scores for each helper
    const matchedHelpers = potentialHelpers
      .map(helper => ({
        ...helper,
        matchScore: calculateMatchScore(helpRequest, helper, preferences),
        skills: helper.skills ? JSON.parse(helper.skills) : []
      }))
      .filter(helper => helper.matchScore > 30) // Only return helpers with decent match
      .sort((a, b) => b.matchScore - a.matchScore) // Sort by match score
      .slice(0, limit) // Limit results

    return NextResponse.json({
      success: true,
      helpRequestId,
      matches: matchedHelpers
    })
  } catch (error) {
    console.error('Error finding matches:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to find matches'
    }, { status: 500 })
  }
}

// POST - Create a help request and automatically find matches
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

    // Create the help request
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
            name: true,
            preferences: true
          }
        }
      }
    })

    // Get requester preferences
    const preferences = helpRequest.requester.preferences
      ? JSON.parse(helpRequest.requester.preferences)
      : {}

    // Get available helpers (exclude requester)
    const potentialHelpers = await db.user.findMany({
      where: {
        id: {
          not: helpRequest.requesterId
        },
        email: {
          not: null
        }
      },
      select: {
        id: true,
        name: true,
        bio: true,
        skills: true,
        location: true,
        isAvailable: true,
        averageRating: true,
        totalRatings: true,
        email: true
      }
    })

    // Calculate match scores for each helper
    const matchedHelpers = potentialHelpers
      .map(helper => ({
        ...helper,
        matchScore: calculateMatchScore(helpRequest, helper, preferences),
        skills: helper.skills ? JSON.parse(helper.skills) : []
      }))
      .filter(helper => helper.matchScore > 30)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 5)

    // Notify top matches
    const topMatches = matchedHelpers.filter(h => h.matchScore >= 50)
    for (const match of topMatches) {
      if (match.email) {
        await db.notification.create({
          data: {
            userId: match.id,
            title: 'New Help Request Match',
            message: `You have a new help request match: "${title}"`,
            type: 'help_request',
            actionUrl: `/help-requests/${helpRequest.id}`
          }
        })
      }
    }

    return NextResponse.json({
      success: true,
      helpRequest,
      matches: matchedHelpers,
      notifiedCount: topMatches.length
    })
  } catch (error) {
    console.error('Error creating help request with matches:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to create help request with matches'
    }, { status: 500 })
  }
}

// PUT - Accept a help request and assign helper
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { helpRequestId, helperId } = body

    if (!helpRequestId || !helperId) {
      return NextResponse.json({
        success: false,
        error: 'Missing helpRequestId or helperId'
      }, { status: 400 })
    }

    // Update help request with helper
    const helpRequest = await db.helpRequest.update({
      where: { id: helpRequestId },
      data: {
        helperId,
        status: 'accepted'
      },
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

    // Notify requester that their request was accepted
    await db.notification.create({
      data: {
        userId: helpRequest.requesterId,
        title: 'Help Request Accepted',
        message: `${helpRequest.helper?.name} has accepted your help request: "${helpRequest.title}"`,
        type: 'help_request',
        actionUrl: `/help-requests/${helpRequestId}`
      }
    })

    return NextResponse.json({
      success: true,
      helpRequest
    })
  } catch (error) {
    console.error('Error accepting help request:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to accept help request'
    }, { status: 500 })
  }
}
