import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSessionUser } from '@/lib/auth'

// POST /api/journal - Create journal entry
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, content, mood, tags, category } = body

    const sessionUser = await getSessionUser(request)
    if (!sessionUser) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    if (!content) {
      return NextResponse.json(
        { success: false, error: 'Content is required' },
        { status: 400 }
      )
    }

    const entry = await db.journalEntry.create({
      data: {
        userId: sessionUser.id,
        title,
        content,
        mood,
        tags: Array.isArray(tags) ? JSON.stringify(tags) : tags,
        category
      }
    })

    return NextResponse.json({ success: true, entry })
  } catch (error) {
    console.error('Error creating journal entry:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create journal entry' },
      { status: 500 }
    )
  }
}

// GET /api/journal - Get journal entries with search/filter
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search')
    const category = searchParams.get('category')
    const mood = searchParams.get('mood')
    const limit = parseInt(searchParams.get('limit') || '50')

    const sessionUser = await getSessionUser(request)
    if (!sessionUser) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const where: any = { userId: sessionUser.id }

    if (category) where.category = category
    if (mood) where.mood = mood

    const entries = await db.journalEntry.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit
    })

    // If search term provided, filter entries
    let filteredEntries = entries
    if (search) {
      const searchTerm = search.toLowerCase()
      filteredEntries = entries.filter((entry: any) => {
        const title = entry.title?.toLowerCase() || ''
        const content = entry.content.toLowerCase()
        const entryTags = entry.tags ? JSON.parse(entry.tags) : []
        return title.includes(searchTerm) ||
               content.includes(searchTerm) ||
               entryTags.some((tag: string) => tag.toLowerCase().includes(searchTerm))
      })
    }

    return NextResponse.json({ success: true, entries: filteredEntries })
  } catch (error) {
    console.error('Error fetching journal entries:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch journal entries' },
      { status: 500 }
    )
  }
}

// PUT /api/journal - Update journal entry
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, title, content, mood, tags, category } = body

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

    const entry = await db.journalEntry.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(content !== undefined && { content }),
        ...(mood !== undefined && { mood }),
        ...(tags !== undefined && { tags: JSON.stringify(tags) }),
        ...(category !== undefined && { category }),
      },
    })

    return NextResponse.json({ success: true, entry })
  } catch (error) {
    console.error('Error updating journal entry:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update journal entry' },
      { status: 500 }
    )
  }
}

// DELETE /api/journal - Delete journal entry
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

    await db.journalEntry.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting journal entry:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete journal entry' },
      { status: 500 }
    )
  }
}
