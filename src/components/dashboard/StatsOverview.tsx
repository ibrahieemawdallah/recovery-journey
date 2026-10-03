"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  Flame,
  Calendar,
  Footprints,
  BookOpen,
  Target,
  TrendingUp,
} from "lucide-react"

interface StatCardProps {
  icon: React.ElementType
  label: string
  value: string | number
  change?: string
  changeType?: "positive" | "negative" | "neutral"
  iconColor: string
  bgColor: string
}

function StatCard({
  icon: Icon,
  label,
  value,
  change,
  changeType = "neutral",
  iconColor,
  bgColor,
}: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
              bgColor
            )}
          >
            <Icon className={cn("h-5 w-5", iconColor)} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-xl font-bold tabular-nums">{value}</p>
          </div>
        </div>
        {change && (
          <div className="mt-2">
            <Badge
              variant={
                changeType === "positive"
                  ? "default"
                  : changeType === "negative"
                    ? "destructive"
                    : "secondary"
              }
              className="text-xs"
            >
              {changeType === "positive" && (
                <TrendingUp className="mr-1 h-3 w-3" />
              )}
              {change}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function StatsOverview() {
  const stats = [
    {
      icon: Flame,
      label: "Current Streak",
      value: "12 days",
      change: "+2 from last week",
      changeType: "positive" as const,
      iconColor: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-50 dark:bg-orange-950/30",
    },
    {
      icon: Calendar,
      label: "Total Sober Days",
      value: "156",
      change: "On track",
      changeType: "positive" as const,
      iconColor: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-950/30",
    },
    {
      icon: Footprints,
      label: "Steps Completed",
      value: "7/12",
      change: "Step 8 in progress",
      changeType: "neutral" as const,
      iconColor: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-950/30",
    },
    {
      icon: BookOpen,
      label: "Journal Entries",
      value: "43",
      change: "+5 this week",
      changeType: "positive" as const,
      iconColor: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-950/30",
    },
    {
      icon: Target,
      label: "Goals Completed",
      value: "8/10",
      change: "2 remaining",
      changeType: "neutral" as const,
      iconColor: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-50 dark:bg-amber-950/30",
    },
  ]

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Your Progress</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>
    </div>
  )
}
