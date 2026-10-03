"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Check, Smile, Meh, Frown, Angry, Laugh } from "lucide-react"

const MOODS = [
  { value: 1, icon: Angry, label: "Struggling", color: "text-red-500" },
  { value: 2, icon: Frown, label: "Low", color: "text-orange-500" },
  { value: 3, icon: Meh, label: "Okay", color: "text-yellow-500" },
  { value: 4, icon: Smile, label: "Good", color: "text-green-500" },
  { value: 5, icon: Laugh, label: "Great", color: "text-emerald-500" },
]

const TRIGGERS = [
  "Stress",
  "Anxiety",
  "Loneliness",
  "Anger",
  "Boredom",
  "Social pressure",
  "Celebration",
  "Fatigue",
  "Conflict",
  "Financial worry",
]

export function DailyCheckIn() {
  const [mood, setMood] = React.useState<number | null>(null)
  const [energy, setEnergy] = React.useState([50])
  const [stress, setStress] = React.useState([50])
  const [selectedTriggers, setSelectedTriggers] = React.useState<string[]>([])
  const [notes, setNotes] = React.useState("")
  const [submitted, setSubmitted] = React.useState(false)

  const toggleTrigger = (trigger: string) => {
    setSelectedTriggers((prev) =>
      prev.includes(trigger)
        ? prev.filter((t) => t !== trigger)
        : [...prev, trigger]
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  if (submitted) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
            <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-lg font-semibold">Check-in Complete</h3>
          <p className="text-sm text-muted-foreground">
            Great job staying consistent with your recovery.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Daily Check-In</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Mood Selector */}
          <div className="space-y-3">
            <Label>How are you feeling today?</Label>
            <div className="flex justify-between gap-2">
              {MOODS.map((m) => {
                const Icon = m.icon
                const isSelected = mood === m.value
                return (
                  <button
                    key={m.value}
                    type="button"
                    onClick={() => setMood(m.value)}
                    className={cn(
                      "flex flex-1 flex-col items-center gap-1 rounded-lg border p-3 transition-all",
                      isSelected
                        ? "border-primary bg-primary/10 ring-2 ring-primary/20"
                        : "border-border hover:bg-muted"
                    )}
                    aria-label={m.label}
                    aria-pressed={isSelected}
                  >
                    <Icon
                      className={cn("h-6 w-6", m.color, isSelected && "scale-110")}
                    />
                    <span className="text-xs font-medium">{m.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Energy Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Energy Level</Label>
              <span className="text-sm font-medium text-muted-foreground">
                {energy[0]}%
              </span>
            </div>
            <Slider
              value={energy}
              onValueChange={setEnergy}
              max={100}
              step={1}
              aria-label="Energy level"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Exhausted</span>
              <span>Energized</span>
            </div>
          </div>

          {/* Stress Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Stress Level</Label>
              <span className="text-sm font-medium text-muted-foreground">
                {stress[0]}%
              </span>
            </div>
            <Slider
              value={stress}
              onValueChange={setStress}
              max={100}
              step={1}
              aria-label="Stress level"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Calm</span>
              <span>Overwhelmed</span>
            </div>
          </div>

          {/* Trigger Chips */}
          <div className="space-y-3">
            <Label>Any triggers today?</Label>
            <div className="flex flex-wrap gap-2">
              {TRIGGERS.map((trigger) => {
                const isSelected = selectedTriggers.includes(trigger)
                return (
                  <Badge
                    key={trigger}
                    variant={isSelected ? "default" : "outline"}
                    className="cursor-pointer transition-colors"
                    onClick={() => toggleTrigger(trigger)}
                  >
                    {trigger}
                  </Badge>
                )
              })}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="checkin-notes">Notes</Label>
            <Textarea
              id="checkin-notes"
              placeholder="How was your day? Any wins or challenges..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full">
            Complete Check-In
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
