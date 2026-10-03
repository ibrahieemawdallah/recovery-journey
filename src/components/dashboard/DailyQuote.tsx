"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { RefreshCw, Quote } from "lucide-react"

const QUOTES = [
  {
    text: "Recovery is not a race. You don't have to feel guilty if it takes you longer than you thought it would.",
    author: "Unknown",
  },
  {
    text: "The only person you are destined to become is the person you decide to be.",
    author: "Ralph Waldo Emerson",
  },
  {
    text: "It does not matter how slowly you go as long as you do not stop.",
    author: "Confucius",
  },
  {
    text: "Our greatest glory is not in never falling, but in rising every time we fall.",
    author: "Confucius",
  },
  {
    text: "You are never too old to set another goal or to dream a new dream.",
    author: "C.S. Lewis",
  },
  {
    text: "The best time to plant a tree was 20 years ago. The second best time is now.",
    author: "Chinese Proverb",
  },
  {
    text: "One day at a time. One step at a time. One moment at a time.",
    author: "Unknown",
  },
  {
    text: "Your present circumstances don't determine where you can go; they merely determine where you start.",
    author: "Nido Qubein",
  },
  {
    text: "Courage is not the absence of fear, but the triumph over it.",
    author: "Nelson Mandela",
  },
  {
    text: "The struggle you're in today is developing the strength you need for tomorrow.",
    author: "Unknown",
  },
  {
    text: "Healing takes courage, and we all have courage, even if we have to dig a little to find it.",
    author: "Tori Amos",
  },
  {
    text: "You don't have to see the whole staircase, just take the first step.",
    author: "Martin Luther King Jr.",
  },
]

export function DailyQuote() {
  const [quoteIndex, setQuoteIndex] = React.useState(() => {
    // Use day of year to show consistent quote per day
    const now = new Date()
    const start = new Date(now.getFullYear(), 0, 0)
    const dayOfYear = Math.floor(
      (now.getTime() - start.getTime()) / 86400000
    )
    return dayOfYear % QUOTES.length
  })
  const [isAnimating, setIsAnimating] = React.useState(false)

  const refreshQuote = () => {
    setIsAnimating(true)
    setTimeout(() => {
      setQuoteIndex((prev) => (prev + 1) % QUOTES.length)
      setIsAnimating(false)
    }, 300)
  }

  const quote = QUOTES[quoteIndex]

  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <Quote className="h-5 w-5 text-primary" />
            Daily Inspiration
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={refreshQuote}
            aria-label="Get new quote"
            className="h-8 w-8"
          >
            <RefreshCw
              className={cn(
                "h-4 w-4 transition-transform duration-300",
                isAnimating && "rotate-180"
              )}
            />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <blockquote
          className={cn(
            "transition-opacity duration-300",
            isAnimating ? "opacity-0" : "opacity-100"
          )}
        >
          <p className="text-base italic leading-relaxed text-foreground">
            "{quote.text}"
          </p>
          <footer className="mt-3 text-sm font-medium text-muted-foreground">
            — {quote.author}
          </footer>
        </blockquote>
      </CardContent>
    </Card>
  )
}
