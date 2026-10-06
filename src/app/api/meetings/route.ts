import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSessionUser } from '@/lib/auth'

/**
 * Meeting attendance log.
 *
 * GET  /api/meetings          -> the user's meeting history (most recent first)
 * POST /api/meetings          -> log a meeting attended
 * DELETE /api/meetings?id=...  -> remove a logged meeting
 *
 * All state is keyed on the session user.
 */

const MEETING_TYPES = ['aa', 'na', 'smart_recovery', 'other'] as const

export async function GET(request: NextRequest) {
  try {
    const user = await getSessionUser(request)
    if (!user) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 })
    }

    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '50')

    const meetings = await db.meeting.findMany({
      where: { userId: user.id },
      orderBy: { date: 'desc' },
      take: limit,
    })

    // Attendance stats, so the UI can show a streak without re-querying.
    const total = await db.meeting.count({ where: { userId: user.id } })
    const last7Days = await db.meeting.count({
      where: {
        userId: user.id,
        date: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      },
    })
    const last30Days = await db.meeting.count({
      where: {
        userId: user.id,
        date: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      },
    })

    return NextResponse.json({
      success: true,
      meetings,
      stats: { total, last7Days, last30Days },
    })
  } catch (error) {
    console.error('Error fetching meetings:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch meetings' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getSessionUser(request)
    if (!user) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 })
    }

    const body = await request.json()
    const { title, type, date, location, notes } = body

    if (!title?.trim()) {
      return NextResponse.json({ success: false, error: 'title is required' }, { status: 400 })
    }

    const meetingType = MEETING_TYPES.includes(type) ? type : 'other'
    const meetingDate = date ? new Date(date) : new Date()
    if (Number.isNaN(meetingDate.getTime())) {
      return NextResponse.json({ success: false, error: 'Invalid date' }, { status: 400 })
    }

    const meeting = await db.meeting.create({
      data: {
        userId: user.id,
        title: String(title).trim(),
        type: meetingType,
        date: meetingDate,
        location: location || null,
        notes: notes || null,
      },
    })

    return NextResponse.json({ success: true, meeting }, { status: 201 })
  } catch (error) {
    console.error('Error logging meeting:', error)
    return NextResponse.json({ success: false, error: 'Failed to log meeting' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getSessionUser(request)
    if (!user) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 })
    }

    const id = request.nextUrl.searchParams.get('id')
    if (!id) {
      return NextResponse.json({ success: false, error: 'id is required' }, { status: 400 })
    }

    // deleteMany scoped to the user so one person cannot remove another's rows.
    const result = await db.meeting.deleteMany({
      where: { id, userId: user.id },
    })

    if (result.count === 0) {
      return NextResponse.json({ success: false, error: 'Meeting not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting meeting:', error)
    return NextResponse.json({ success: false, error: 'Failed to delete meeting' }, { status: 500 })
  }
}
