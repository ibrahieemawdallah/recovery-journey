import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Mentorship roles and matching
const MENTOR_ROLES = {
  sponsor: 'Sponsor - Experienced person in recovery guiding someone through the steps',
  mentor: 'Mentor - Professional offering guidance and support',
  peer_supporter: 'Peer Support - Someone further along in recovery offering support',
  accountability_partner: 'Accountability Partner - Trusted person helping track progress'
}

// GET /api/peer-support - Get available mentors/supporters and history
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')
    const role = searchParams.get('role')
    const action = searchParams.get('action') // 'available' or 'sessions'

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'userId is required' },
        { status: 400 }
      )
    }

    // Get user's peer support session history
    if (action === 'sessions') {
      const limit = parseInt(searchParams.get('limit') || '20')
      const sessions = await db.groupChatMessage.findMany({
        where: {
          userId,
          group: 'peer-support'
        },
        orderBy: { timestamp: 'desc' },
        take: limit
      })

      return NextResponse.json({
        success: true,
        sessions: sessions.map((session: any) => ({
          id: session.id,
          message: session.message,
          timestamp: session.timestamp,
          supporterId: session.message.match(/With (\d+)/)?.[1] || 'unknown'
        }))
      })
    }

    // Get available supporters
    const availableSupporters = await db.user.findMany({
      where: {
        id: { not: userId },
        isAvailable: true,
        email: { not: null }
      },
      select: {
        id: true,
        name: true,
        bio: true,
        skills: true,
        averageRating: true,
        totalRatings: true,
        location: true
      },
      take: 10
    })

    return NextResponse.json({
      success: true,
      supporters: availableSupporters.map(s => ({
        ...s,
        skills: s.skills ? JSON.parse(s.skills) : []
      }))
    })
  } catch (error) {
    console.error('Error in peer support GET:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch peer support data' },
      { status: 500 }
    )
  }
}

// POST /api/peer-support - Create requests, connections, or sessions
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, userId, supporterId, role, preferences, recoveryDate, goals, topic, notes } = body

    if (!userId || !action) {
      return NextResponse.json(
        { success: false, error: 'userId and action are required' },
        { status: 400 }
      )
    }

    // Handle different actions
    if (action === 'request') {
      // Request a sponsor/mentor
      if (!role) {
        return NextResponse.json(
          { success: false, error: 'role is required for request' },
          { status: 400 }
        )
      }

      const mentorshipRequest = await db.groupChatMessage.create({
        data: {
          userId,
          userName: 'System',
          groupName: 'peer-support',
          message: `MENTORSHIP REQUEST - Role: ${role}, Goals: ${JSON.stringify(goals)}`,
          timestamp: new Date()
        }
      })

      return NextResponse.json({
        success: true,
        request: {
          id: mentorshipRequest.id,
          status: 'pending',
          created: new Date().toISOString()
        }
      })
    }

    if (action === 'connect') {
      // Connect with a supporter
      if (!supporterId) {
        return NextResponse.json(
          { success: false, error: 'supporterId is required for connect' },
          { status: 400 }
        )
      }

      const connection = await db.groupChatMessage.create({
        data: {
          userId,
          userName: 'System',
          groupName: 'peer-support',
          message: `PEER CONNECTION - Connected with supporter: ${supporterId}`,
          timestamp: new Date()
        }
      })

      // Award achievement
      const user = await db.user.findUnique({
        where: { id: userId },
        select: { achievements: true }
      })

      const currentAchievements = user?.achievements ? JSON.parse(user.achievements) : []
      const updatedAchievements = JSON.stringify([...currentAchievements, 'peer_connection'])

      await db.user.update({
        where: { id: userId },
        data: {
          achievements: updatedAchievements
        }
      })

      return NextResponse.json({
        success: true,
        connection: {
          id: connection.id,
          supporterId,
          status: 'active',
          connectedAt: new Date().toISOString()
        }
      })
    }

    if (action === 'session') {
      // Create a peer support session
      if (!supporterId) {
        return NextResponse.json(
          { success: false, error: 'supporterId is required for session' },
          { status: 400 }
        )
      }

      const session = await db.groupChatMessage.create({
        data: {
          userId,
          userName: 'System',
          groupName: 'peer-support',
          message: `PEER SESSION - With ${supporterId}, Topic: ${topic}, Notes: ${notes}`,
          timestamp: new Date()
        }
      })

      return NextResponse.json({
        success: true,
        session: {
          id: session.id,
          supporterId,
          topic,
          notes,
          status: 'active',
          createdAt: new Date().toISOString()
        }
      })
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error in peer support POST:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to process peer support request' },
      { status: 500 }
    )
  }
}
