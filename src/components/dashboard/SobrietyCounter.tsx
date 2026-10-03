"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Flame, Trophy, Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface SobrietyCounterProps {
  recoveryDate?: string
  className?: string
}

const MILESTONES = [
  { days: 1, label: "24 Hours", icon: Star },
  { days: 7, label: "1 Week", icon: Star },
  { days: 30, label: "30 Days", icon: Trophy },
  { days: 90, label: "90 Days", icon: Trophy },
  { days: 180, label: "6 Months", icon: Trophy },
  { days: 365, label: "1 Year", icon: Flame },
  { days: 730, label: "2 Years", icon: Flame },
  { days: 1825, label: "5 Years", icon: Flame },
]

export function SobrietyCounter({
  recoveryDate = "2025-01-01",
  className,
}: SobrietyCounterProps) {
  const [now, setNow] = React.useState(new Date())

  React.useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  const start = new Date(recoveryDate)
  const diffMs = now.getTime() - start.getTime()
  const totalSeconds = Math.max(0, Math.floor(diffMs / 1000))

  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  // Calculate progress to next milestone
  const nextMilestone = MILESTONES.find((m) => m.days > days)
  const prevMilestone = [...MILESTONES].reverse().find((m) => m.days <= days)
  const progress = nextMilestone
    ? ((days - (prevMilestone?.days ?? 0)) /
        (nextMilestone.days - (prevMilestone?.days ?? 0))) *
      100
    : 100

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Sobriety Counter</CardTitle>
          <Badge variant="secondary" className="gap-1">
            <Flame className="h-3 w-3" />
            {days} days
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main counter */}
        <div className="grid grid-cols-4 gap-2 text-center">
          {[
            { value: days, label: "Days" },
            { value: hours, label: "Hours" },
            { value: minutes, label: "Min" },
            { value: seconds, label: "Sec" },
          ].map((unit) => (
            <div
              key={unit.label}
              className="rounded-lg bg-muted/50 p-3"
            >
              <div className="text-2xl font-bold tabular-nums text-primary">
                {unit.value.toString().padStart(2, "0")}
              </div>
              <div className="text-xs text-muted-foreground">{unit.label}</div>
            </div>
          ))}
        </div>

        {/* Progress to next milestone */}
        {nextMilestone && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Next milestone: {nextMilestone.label}
              </span>
              <span className="font-medium">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {/* Milestone markers */}
        <div className="flex flex-wrap gap-2">
          {MILESTONES.map((milestone) => {
            const achieved = days >= milestone.days
            const Icon = milestone.icon
            return (
              <Badge
                key={milestone.days}
                variant={achieved ? "default" : "outline"}
                className={cn(
                  "gap-1 text-xs",
                  achieved && "bg-primary text-primary-foreground"
                )}
              >
                <Icon className="h-3 w-3" />
                {milestone.label}
              </Badge>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
