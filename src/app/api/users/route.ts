import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSessionUser } from '@/lib/auth'

// POST /api/users - Create or update user (onboarding)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, recoveryDate, selectedGroup, bio, skills, preferences, location, isAvailable, password } = body

    // If email provided, try to find existing user
    let user
    if (email) {
      user = await db.user.findUnique({
        where: { email }
      })
    }

    if (user) {
      // Update existing user
      user = await db.user.update({
        where: { email },
        data: {
          name: name || user.name,
          recoveryDate: recoveryDate ? new Date(recoveryDate) : user.recoveryDate,
          selectedGroup: selectedGroup || user.selectedGroup,
          bio: bio !== undefined ? bio : user.bio,
          skills: skills !== undefined ? JSON.stringify(skills) : user.skills,
          preferences: preferences !== undefined ? JSON.stringify(preferences) : user.preferences,
          location: location !== undefined ? location : user.location,
          isAvailable: isAvailable !== undefined ? isAvailable : user.isAvailable,
          password: password !== undefined ? password : user.password
        }
      })
    } else {
      // Create new user
      user = await db.user.create({
        data: {
          name,
          email: email || `user-${Date.now()}@temp.com`,
          recoveryDate: recoveryDate ? new Date(recoveryDate) : null,
          selectedGroup,
          bio: bio || null,
          skills: skills ? JSON.stringify(skills) : null,
          preferences: preferences ? JSON.stringify(preferences) : null,
          location: location || null,
          isAvailable: isAvailable || false,
          password: password || null
        }
      })
    }

    return NextResponse.json({ success: true, user })
  } catch (error) {
    console.error('Error saving user:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to save user' },
      { status: 500 }
    )
  }
}

// GET /api/users - Get user by email (onboarding) or by session
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const email = searchParams.get('email')

    // If email param provided, use it (onboarding flow)
    if (email) {
      const user = await db.user.findUnique({
        where: { email },
        include: {
          dailyCheckins: true,
          stepProgress: true,
          gratitudeEntries: true,
          journalEntries: true,
          workTasks: true
        }
      })

      if (!user) {
        return NextResponse.json(
          { success: false, error: 'User not found' },
          { status: 404 }
        )
      }

      return NextResponse.json({ success: true, user })
    }

    // Otherwise require session
    const sessionUser = await getSessionUser(request)
    if (!sessionUser) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const user = await db.user.findUnique({
      where: { id: sessionUser.id },
      include: {
        dailyCheckins: true,
        stepProgress: true,
        gratitudeEntries: true,
        journalEntries: true,
        workTasks: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, user })
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch user' },
      { status: 500 }
    )
  }
}
