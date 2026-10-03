"use client"

import * as React from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  ClipboardCheck,
  BookOpen,
  MessageCircle,
  Phone,
  Wind,
  Brain,
  ArrowRight,
} from "lucide-react"

const actions = [
  {
    href: "/check-in",
    icon: ClipboardCheck,
    label: "Daily Check-In",
    description: "Log your mood and progress",
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
  },
  {
    href: "/journal",
    icon: BookOpen,
    label: "Journal",
    description: "Write your thoughts",
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-50 dark:bg-purple-950/30",
  },
  {
    href: "/chat",
    icon: MessageCircle,
    label: "AI Chat",
    description: "Talk to your coach",
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-50 dark:bg-green-950/30",
  },
  {
    href: "/crisis",
    icon: Phone,
    label: "Crisis Support",
    description: "Get immediate help",
    color: "text-red-600 dark:text-red-400",
    bgColor: "bg-red-50 dark:bg-red-950/30",
  },
  {
    href: "/tools/breathing",
    icon: Wind,
    label: "Breathing",
    description: "Calm your mind",
    color: "text-cyan-600 dark:text-cyan-400",
    bgColor: "bg-cyan-50 dark:bg-cyan-950/30",
  },
  {
    href: "/tools/thought-record",
    icon: Brain,
    label: "Thought Record",
    description: "Challenge negative thoughts",
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-50 dark:bg-amber-950/30",
  },
]

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {actions.map((action) => {
            const Icon = action.icon
            return (
              <Link key={action.href} href={action.href}>
                <div
                  className={cn(
                    "group flex flex-col items-center gap-2 rounded-lg border p-4 text-center transition-all hover:border-primary/50 hover:shadow-sm"
                  )}
                >
                  <div
                    className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-full",
                      action.bgColor
                    )}
                  >
                    <Icon className={cn("h-6 w-6", action.color)} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{action.label}</p>
                    <p className="text-xs text-muted-foreground">
                      {action.description}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
              </Link>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
