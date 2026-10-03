'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CalendarPickerProps {
  value: string
  onChange: (date: string) => void
  language?: 'en' | 'ar'
}

const MONTHS_EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const MONTHS_AR = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر']
const DAYS_EN = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const DAYS_AR = ['أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت']

export function CalendarPicker({ value, onChange, language = 'en' }: CalendarPickerProps) {
  const today = new Date()
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    value ? new Date(value + 'T00:00:00') : null
  )
  const [isOpen, setIsOpen] = useState(false)

  const months = language === 'ar' ? MONTHS_AR : MONTHS_EN
  const days = language === 'ar' ? DAYS_AR : DAYS_EN

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay()
  }

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  const handleDateSelect = (day: number) => {
    const date = new Date(currentYear, currentMonth, day)
    setSelectedDate(date)
    const formatted = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    onChange(formatted)
    setIsOpen(false)
  }

  const isToday = (day: number) => {
    return (
      day === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear()
    )
  }

  const isSelected = (day: number) => {
    if (!selectedDate) return false
    return (
      day === selectedDate.getDate() &&
      currentMonth === selectedDate.getMonth() &&
      currentYear === selectedDate.getFullYear()
    )
  }

  const daysInMonth = getDaysInMonth(currentMonth, currentYear)
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear)

  const calendarDays = []
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null)
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i)
  }

  const displayValue = selectedDate
    ? language === 'ar'
      ? selectedDate.toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })
      : selectedDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : ''

  return (
    <div className="relative">
      <Button
        type="button"
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full justify-start text-left font-normal h-12 text-lg"
      >
        <span className={cn(!selectedDate && 'text-muted-foreground')}>
          {displayValue || (language === 'ar' ? 'اختر تاريخاً' : 'Select a date')}
        </span>
      </Button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute z-50 mt-2 w-full rounded-xl border bg-popover p-4 shadow-xl animate-in fade-in-0 zoom-in-95">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handlePrevMonth}
                className="h-8 w-8"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="text-sm font-semibold">
                {months[currentMonth]} {currentYear}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleNextMonth}
                className="h-8 w-8"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {days.map((day, i) => (
                <div key={i} className="text-center text-xs font-medium text-muted-foreground py-1">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, i) => (
                <div key={i} className="aspect-square">
                  {day && (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => handleDateSelect(day)}
                      className={cn(
                        'h-full w-full rounded-lg text-sm font-medium transition-all',
                        isSelected(day)
                          ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                          : isToday(day)
                            ? 'bg-primary/10 text-primary hover:bg-primary/20'
                            : 'hover:bg-muted'
                      )}
                    >
                      {day}
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {/* Today button */}
            <div className="mt-3 pt-3 border-t">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => {
                  const today = new Date()
                  setCurrentMonth(today.getMonth())
                  setCurrentYear(today.getFullYear())
                  handleDateSelect(today.getDate())
                }}
              >
                {language === 'ar' ? 'اليوم' : 'Today'}
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
