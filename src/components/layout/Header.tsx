"use client"

import * as React from "react"
import { Bell, Moon, Sun, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LanguageToggle } from "./LanguageToggle"
import { TreeLogoMark } from "@/components/brand/tree-logo-mark"
import { cn } from "@/lib/utils"

export function Header() {
  const [isDark, setIsDark] = React.useState(false)
  const [hasNotifications, setHasNotifications] = React.useState(true)

  React.useEffect(() => {
    const root = document.documentElement
    setIsDark(root.classList.contains("dark"))
  }, [])

  const toggleDarkMode = () => {
    const root = document.documentElement
    root.classList.toggle("dark")
    setIsDark(root.classList.contains("dark"))
  }

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:px-6">
      {/* App name */}
      <div className="flex items-center gap-2">
        <TreeLogoMark className="h-9 w-9" title="Recovery Journey" />
        <h1 className="text-lg font-semibold tracking-tight">
          Recovery Journey
        </h1>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <LanguageToggle />

        <Button
          variant="ghost"
          size="icon"
          onClick={toggleDarkMode}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          {hasNotifications && (
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
          )}
        </Button>

        <Button
          variant="destructive"
          size="sm"
          className="hidden sm:inline-flex"
        >
          <Phone className="h-4 w-4" />
          <span className="ml-2">Crisis</span>
        </Button>
      </div>
    </header>
  )
}
