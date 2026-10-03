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
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

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

export function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = React.useState(false)

  return (
    <aside
      className={cn(
        "hidden md:flex md:flex-col md:border-r md:bg-sidebar transition-[width] duration-300 ease-in-out",
        collapsed ? "md:w-16" : "md:w-64"
      )}
    >
      {/* Header */}
      <div className={cn("flex h-16 items-center border-b px-4", collapsed && "justify-center px-2")}>
        {!collapsed && (
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="text-lg">🌱</span>
            <span className="text-sm">Recovery Journey</span>
          </Link>
        )}
        {collapsed && <span className="text-lg">🌱</span>}
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-2 py-4">
        <nav className="flex flex-col gap-1" aria-label="Main navigation">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
                  collapsed && "justify-center px-2"
                )}
                aria-current={isActive ? "page" : undefined}
                title={collapsed ? item.label : undefined}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </Link>
            )
          })}
        </nav>
      </ScrollArea>

      {/* Collapse toggle */}
      <div className="border-t p-2">
        <Button
          variant="ghost"
          size="sm"
          className={cn("w-full", collapsed && "px-2")}
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4" />
              <span className="ml-2 text-xs">Collapse</span>
            </>
          )}
        </Button>
      </div>
    </aside>
  )
}
