import { NextRequest, NextResponse } from 'next/server'

const QUOTES = [
  "Recovery is not a race. You don't have to feel guilty if it takes you longer than you thought it would.",
  "One day at a time. One step at a time. One moment at a time.",
  "Your present circumstances don't determine where you can go. They merely determine where you start.",
  "The only person you are destined to become is the person you decide to be.",
  "Every moment is a fresh beginning.",
  "You never know how strong you are until being strong is your only choice.",
  "Believe you can and you're halfway there.",
  "The best way out is always through.",
  "Rock bottom became the solid foundation on which I rebuilt my life.",
  "Courage is not having the strength to go on; it is going on when you don't have the strength.",
  "Fall seven times, stand up eight.",
  "Success is not final, failure is not fatal: it is the courage to continue that counts.",
  "What lies behind us and what lies before us are tiny matters compared to what lies within us.",
  "The greatest glory in living lies not in never falling, but in rising every time we fall.",
  "Change is the law of life. And those who look only to the past or present are certain to miss the future.",
  "It does not matter how slowly you go as long as you do not stop.",
  "You are braver than you believe, stronger than you seem, and smarter than you think.",
  "When you feel like giving up, remember why you held on for so long.",
  "The journey of a thousand miles begins with one step.",
  "Every adversity, every failure, every heartache carries with it the seed of an equal or greater benefit.",
  "Don't watch the clock; do what it does. Keep going.",
  "The secret of getting ahead is getting started.",
  "It always seems impossible until it's done.",
  "Believe in yourself and all that you are. Know that there is something inside you that is greater than any obstacle.",
  "Hardships often prepare ordinary people for an extraordinary destiny.",
  "Keep your face always toward the sunshine—and shadows will fall behind you.",
  "Life isn't about waiting for the storm to pass, it's about learning to dance in the rain.",
  "You have power over your mind—not outside events. Realize this, and you will find strength.",
  "What you get by achieving your goals is not as important as what you become by achieving your goals.",
  "In the middle of every difficulty lies opportunity.",
  "The only way to do great work is to love what you do.",
  "I am not a product of my circumstances. I am a product of my decisions.",
  "Your limitation—it's only your imagination.",
  "Push yourself, because no one else is going to do it for you.",
  "Great things never come from comfort zones.",
  "Dream it. Wish it. Do it.",
  "Success doesn't just find you. You have to go out and get it.",
  "The harder you work for something, the greater you'll feel when you achieve it.",
  "Dream bigger. Do bigger.",
  "Don't stop when you're tired. Stop when you're done."
]

export async function GET(request: NextRequest) {
  try {
    const today = new Date()
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000)
    const quoteIndex = dayOfYear % QUOTES.length

    return NextResponse.json({
      success: true,
      quote: QUOTES[quoteIndex],
      date: today.toISOString()
    })
  } catch (error) {
    console.error('Error fetching quote:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch quote'
    }, { status: 500 })
  }
}
