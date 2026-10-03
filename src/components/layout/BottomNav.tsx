"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  Footprints,
  MessageCircle,
  Stethoscope,
  Wrench,
  TrendingUp,
  BookOpen,
  User,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/", icon: Home, label: "Home", labelAr: "الرئيسية" },
  { href: "/steps", icon: Footprints, label: "Steps", labelAr: "الخطوات" },
  { href: "/chat", icon: MessageCircle, label: "Chat", labelAr: "المحادثة" },
  { href: "/clinical", icon: Stethoscope, label: "Clinical", labelAr: "السريري" },
  { href: "/tools", icon: Wrench, label: "Tools", labelAr: "الأدوات" },
  { href: "/track", icon: TrendingUp, label: "Track", labelAr: "التتبع" },
  { href: "/journal", icon: BookOpen, label: "Journal", labelAr: "اليوميات" },
  { href: "/profile", icon: User, label: "Profile", labelAr: "الملف الشخصي" },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden"
      aria-label="Main navigation"
    >
      <div className="mx-auto flex h-16 max-w-lg items-center justify-around px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 rounded-lg px-2 py-1.5 text-xs font-medium transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className="h-5 w-5" />
              <span className="truncate text-[10px] leading-tight">
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
