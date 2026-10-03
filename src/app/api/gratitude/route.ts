import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSessionUser } from '@/lib/auth'

// POST /api/gratitude - Create gratitude entry
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { entry } = body

    const sessionUser = await getSessionUser(request)
    if (!sessionUser) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    if (!entry) {
      return NextResponse.json(
        { success: false, error: 'Entry is required' },
        { status: 400 }
      )
    }

    const gratitude = await db.gratitudeEntry.create({
      data: {
        userId: sessionUser.id,
        entry
      }
    })

    return NextResponse.json({ success: true, gratitude })
  } catch (error) {
    console.error('Error creating gratitude entry:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create gratitude entry' },
      { status: 500 }
    )
  }
}

// GET /api/gratitude - Get gratitude entries for user
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

    const gratitudes = await db.gratitudeEntry.findMany({
      where: { userId: sessionUser.id },
      orderBy: { createdAt: 'desc' },
      take: 50
    })

    return NextResponse.json({ success: true, gratitudes })
  } catch (error) {
    console.error('Error fetching gratitude entries:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch gratitude entries' },
      { status: 500 }
    )
  }
}

// DELETE /api/gratitude - Delete gratitude entry
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

    await db.gratitudeEntry.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting gratitude entry:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete gratitude entry' },
      { status: 500 }
    )
  }
}
