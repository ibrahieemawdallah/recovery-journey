import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET - Fetch resources
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const authorId = searchParams.get('authorId')
    const popular = searchParams.get('popular') === 'true'

    let whereClause: any = {
      isPublic: true
    }

    if (category) {
      whereClause.category = category
    }

    if (authorId) {
      whereClause.authorId = authorId
    }

    if (search) {
      whereClause.OR = [
        { title: { contains: search } },
        { description: { contains: search } }
      ]
    }

    let orderBy: any = { createdAt: 'desc' }

    if (popular) {
      orderBy = { helpful: 'desc' }
    }

    const resources = await db.resource.findMany({
      where: whereClause,
      include: {
        author: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy
    })

    return NextResponse.json({
      success: true,
      resources
    })
  } catch (error) {
    console.error('Error fetching resources:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch resources'
    }, { status: 500 })
  }
}

// POST - Create a new resource
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, content, category, tags, url, authorId, isPublic } = body

    if (!title || !description || !category) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields'
      }, { status: 400 })
    }

    const resource = await db.resource.create({
      data: {
        title,
        description,
        content: content || null,
        category,
        tags: tags ? JSON.stringify(tags) : null,
        url: url || null,
        authorId: authorId || null,
        isPublic: isPublic !== undefined ? isPublic : true
      },
      include: {
        author: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      resource
    })
  } catch (error) {
    console.error('Error creating resource:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to create resource'
    }, { status: 500 })
  }
}

// PUT - Update a resource (including view count and helpful votes)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, title, description, content, category, tags, url, incrementView, markHelpful } = body

    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'Missing resource ID'
      }, { status: 400 })
    }

    // Handle view increment
    if (incrementView) {
      const resource = await db.resource.update({
        where: { id },
        data: {
          views: {
            increment: 1
          }
        }
      })

      return NextResponse.json({
        success: true,
        resource
      })
    }

    // Handle helpful vote
    if (markHelpful) {
      const resource = await db.resource.update({
        where: { id },
        data: {
          helpful: {
            increment: 1
          }
        }
      })

      return NextResponse.json({
        success: true,
        resource
      })
    }

    // Regular update
    const updateData: any = {}

    if (title) updateData.title = title
    if (description) updateData.description = description
    if (content !== undefined) updateData.content = content
    if (category) updateData.category = category
    if (tags !== undefined) updateData.tags = JSON.stringify(tags)
    if (url !== undefined) updateData.url = url

    const resource = await db.resource.update({
      where: { id },
      data: updateData,
      include: {
        author: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      resource
    })
  } catch (error) {
    console.error('Error updating resource:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to update resource'
    }, { status: 500 })
  }
}

// DELETE - Delete a resource
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'Missing resource ID'
      }, { status: 400 })
    }

    await db.resource.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Resource deleted'
    })
  } catch (error) {
    console.error('Error deleting resource:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to delete resource'
    }, { status: 500 })
  }
}
