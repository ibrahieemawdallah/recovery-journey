import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSessionUser } from '@/lib/auth'

// Achievement definitions
const ACHIEVEMENTS = [
  { id: 'first-step', title: 'First Step', description: 'Complete your first 12-step', icon: '🎯' },
  { id: 'three-steps', title: 'Third Step', description: 'Complete 3 steps of the program', icon: '🏃' },
  { id: 'week-one', title: 'First Week', description: 'Complete 7 days of sobriety', icon: '📅' },
  { id: 'thirty-days', title: 'One Month', description: 'Reach 30 days of sobriety', icon: '🎉' },
  { id: 'ninety-days', title: 'Three Months', description: 'Reach 90 days of sobriety', icon: '🌟' },
  { id: 'streak-seven', title: '7-Day Streak', description: 'Complete daily tasks for 7 days in a row', icon: '🔥' },
  { id: 'streak-thirty', title: '30-Day Streak', description: 'Complete daily tasks for 30 days in a row', icon: '💪' },
  { id: 'journal-ten', title: 'Journal Keeper', description: 'Write 10 journal entries', icon: '📓' },
  { id: 'gratitude-thirty', title: 'Grateful Heart', description: 'Add 30 gratitude entries', icon: '💚' },
  { id: 'goals-twenty', title: 'Goal Achiever', description: 'Complete 20 daily goals', icon: '🎖' },
]

// Inspirational quotes
const QUOTES = [
  "Recovery is a journey, not a destination.",
  "One day at a time. One step at a time.",
  "Progress, not perfection.",
  "Your best is enough.",
  "Believe in yourself and all that you are.",
  "Every day is a new opportunity for growth.",
  "Strength grows in the moments you think you can't go on.",
  "You are stronger than you think.",
  "It never gets easier, you just get better.",
  "Small progress is still progress.",
  "Keep going, you're doing great.",
  "The only way out is through.",
  "Hope is the power to keep moving forward.",
  "Be kind to yourself today.",
  "You deserve to be happy and healthy.",
  "Trust the process, trust yourself.",
]

// GET /api/achievements - Get all available achievements and user's progress
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

    // Get user data to check achievements
    const user = await db.user.findUnique({
      where: { id: sessionUser.id },
      select: {
        achievements: true,
        currentStreak: true,
        longestStreak: true,
        totalDays: true
      }
    })

    // Get counts for achievements
    const completedSteps = await db.stepProgress.count({
      where: { userId: sessionUser.id, completed: true }
    })

    const journalCount = await db.journalEntry.count({
      where: { userId: sessionUser.id }
    })

    const gratitudeCount = await db.gratitudeEntry.count({
      where: { userId: sessionUser.id }
    })

    const completedGoals = await db.dailyGoal.count({
      where: { userId: sessionUser.id, completed: true }
    })

    // Determine which achievements user has unlocked
    const userAchievements = user?.achievements
      ? JSON.parse(user.achievements)
      : []

    const unlockedAchievements = ACHIEVEMENTS.filter(achievement => {
      if (achievement.id === 'three-steps') return completedSteps >= 3
      if (achievement.id === 'thirty-days') return (user?.totalDays || 0) >= 30
      if (achievement.id === 'ninety-days') return (user?.totalDays || 0) >= 90
      if (achievement.id === 'streak-seven') return (user?.currentStreak || 0) >= 7
      if (achievement.id === 'streak-thirty') return (user?.currentStreak || 0) >= 30
      if (achievement.id === 'journal-ten') return journalCount >= 10
      if (achievement.id === 'gratitude-thirty') return gratitudeCount >= 30
      if (achievement.id === 'goals-twenty') return completedGoals >= 20
      return false
    })

    // Add newly unlocked achievements
    const newAchievements = unlockedAchievements.filter(a => !userAchievements.includes(a.id))

    if (newAchievements.length > 0) {
      await db.user.update({
        where: { id: sessionUser.id },
        data: {
          achievements: JSON.stringify([...userAchievements, ...newAchievements.map(a => a.id)])
        }
      })
    }

    return NextResponse.json({
      success: true,
      allAchievements: ACHIEVEMENTS,
      userAchievements: unlockedAchievements,
      stats: {
        completedSteps,
        journalCount,
        gratitudeCount,
        completedGoals,
        currentStreak: user?.currentStreak || 0,
        longestStreak: user?.longestStreak || 0,
        totalDays: user?.totalDays || 0
      }
    })
  } catch (error) {
    console.error('Error fetching achievements:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch achievements' },
      { status: 500 }
    )
  }
}

// GET /api/achievements/quote - Get random inspirational quote
export async function GET_QUOTE() {
  try {
    const randomIndex = Math.floor(Math.random() * QUOTES.length)
    return NextResponse.json({
      success: true,
      quote: QUOTES[randomIndex]
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to get quote' },
      { status: 500 }
    )
  }
}
