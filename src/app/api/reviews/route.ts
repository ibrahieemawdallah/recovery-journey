import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET - Fetch reviews
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const revieweeId = searchParams.get('revieweeId')
    const reviewerId = searchParams.get('reviewerId')
    const sessionId = searchParams.get('sessionId')

    let whereClause: any = {}

    if (revieweeId) whereClause.revieweeId = revieweeId
    if (reviewerId) whereClause.reviewerId = reviewerId
    if (sessionId) whereClause.sessionId = sessionId

    const reviews = await db.review.findMany({
      where: whereClause,
      include: {
        reviewer: {
          select: {
            id: true,
            name: true
          }
        },
        reviewee: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({
      success: true,
      reviews
    })
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch reviews'
    }, { status: 500 })
  }
}

// POST - Create a new review
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { reviewerId, revieweeId, sessionId, rating, comment } = body

    if (!reviewerId || !revieweeId || !rating) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields'
      }, { status: 400 })
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({
        success: false,
        error: 'Rating must be between 1 and 5'
      }, { status: 400 })
    }

    const review = await db.review.create({
      data: {
        reviewerId,
        revieweeId,
        sessionId: sessionId || null,
        rating,
        comment: comment || null
      },
      include: {
        reviewer: {
          select: {
            id: true,
            name: true
          }
        },
        reviewee: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    // Update user's average rating
    const allReviews = await db.review.findMany({
      where: { revieweeId }
    })

    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length

    await db.user.update({
      where: { id: revieweeId },
      data: {
        averageRating: avgRating,
        totalRatings: allReviews.length
      }
    })

    // Notify the reviewee
    await db.notification.create({
      data: {
        userId: revieweeId,
        title: 'New Review Received',
        message: `You received a ${rating}-star review from ${review.reviewer.name}`,
        type: 'review',
        actionUrl: null
      }
    })

    return NextResponse.json({
      success: true,
      review
    })
  } catch (error) {
    console.error('Error creating review:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to create review'
    }, { status: 500 })
  }
}

// DELETE - Delete a review
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'Missing review ID'
      }, { status: 400 })
    }

    const review = await db.review.findUnique({
      where: { id }
    })

    if (!review) {
      return NextResponse.json({
        success: false,
        error: 'Review not found'
      }, { status: 404 })
    }

    await db.review.delete({
      where: { id }
    })

    // Recalculate average rating for the reviewee
    const allReviews = await db.review.findMany({
      where: { revieweeId: review.revieweeId }
    })

    if (allReviews.length > 0) {
      const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length

      await db.user.update({
        where: { id: review.revieweeId },
        data: {
          averageRating: avgRating,
          totalRatings: allReviews.length
        }
      })
    } else {
      await db.user.update({
        where: { id: review.revieweeId },
        data: {
          averageRating: 0,
          totalRatings: 0
        }
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Review deleted'
    })
  } catch (error) {
    console.error('Error deleting review:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to delete review'
    }, { status: 500 })
  }
}
