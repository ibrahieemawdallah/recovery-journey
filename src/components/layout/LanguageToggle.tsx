"use client"

import * as React from "react"
import { Languages } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Language = "en" | "ar"

export function LanguageToggle() {
  const [lang, setLang] = React.useState<Language>("en")

  const toggleLanguage = () => {
    const newLang = lang === "en" ? "ar" : "en"
    setLang(newLang)
    document.documentElement.lang = newLang
    document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr"
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="gap-1.5"
      aria-label={`Switch to ${lang === "en" ? "Arabic" : "English"}`}
    >
      <Languages className="h-4 w-4" />
      <span className="text-xs font-medium uppercase">{lang}</span>
    </Button>
  )
}
