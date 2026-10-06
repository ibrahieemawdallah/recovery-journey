'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { BottomNav } from '@/components/layout/BottomNav'
import { CrisisButton } from '@/components/layout/CrisisButton'
import {
  Calendar, MapPin, Plus, Trash2, Loader2, Users, Clock,
} from 'lucide-react'

type Lang = 'en' | 'ar'

type Meeting = {
  id: string
  title: string
  type: string
  date: string
  location: string | null
  notes: string | null
}

const MEETING_TYPES = [
  { value: 'aa', label: { en: 'AA', ar: 'AA' } },
  { value: 'na', label: { en: 'NA', ar: 'NA' } },
  { value: 'smart_recovery', label: { en: 'SMART Recovery', ar: 'SMART Recovery' } },
  { value: 'other', label: { en: 'Other', ar: 'أخرى' } },
]

export default function MeetingsPage() {
  const [language, setLanguage] = useState<Lang>('en')
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [stats, setStats] = useState({ total: 0, last7Days: 0, last30Days: 0 })
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [title, setTitle] = useState('')
  const [type, setType] = useState('aa')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [location, setLocation] = useState('')
  const [notes, setNotes] = useState('')

  const t = (en: string, ar: string) => (language === 'en' ? en : ar)

  useEffect(() => {
    const saved = localStorage.getItem('language') as Lang | null
    if (saved) setLanguage(saved)
    void loadMeetings()
  }, [])

  const loadMeetings = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/meetings')
      const data = await res.json()
      if (data.success) {
        setMeetings(data.meetings || [])
        setStats(data.stats || { total: 0, last7Days: 0, last30Days: 0 })
      }
    } catch (err) {
      console.error('Error loading meetings:', err)
    } finally {
      setLoading(false)
    }
  }

  const logMeeting = async () => {
    if (!title.trim()) return
    setSaving(true)
    try {
      const res = await fetch('/api/meetings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          type,
          date,
          location: location.trim() || undefined,
          notes: notes.trim() || undefined,
        }),
      })
      if (res.ok) {
        setShowForm(false)
        setTitle('')
        setLocation('')
        setNotes('')
        setDate(new Date().toISOString().split('T')[0])
        await loadMeetings()
      }
    } catch (err) {
      console.error('Error logging meeting:', err)
    } finally {
      setSaving(false)
    }
  }

  const deleteMeeting = async (id: string) => {
    setMeetings((prev) => prev.filter((m) => m.id !== id))
    try {
      await fetch(`/api/meetings?id=${id}`, { method: 'DELETE' })
      await loadMeetings()
    } catch (err) {
      console.error('Error deleting meeting:', err)
    }
  }

  const getTypeLabel = (value: string) => {
    const found = MEETING_TYPES.find((m) => m.value === value)
    return found?.label[language] ?? value
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Calendar className="w-6 h-6" />
              {t('Meetings', 'الاجتماعات')}
            </h1>
            <p className="text-muted-foreground">
              {t('Track your AA/NA meeting attendance', 'تتبع حضورك لاجتماعات AA/NA')}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const next = language === 'en' ? 'ar' : 'en'
              setLanguage(next)
              localStorage.setItem('language', next)
            }}
          >
            {language === 'en' ? 'العربية' : 'English'}
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-xs text-muted-foreground">{t('Total', 'الإجمالي')}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold">{stats.last7Days}</div>
              <div className="text-xs text-muted-foreground">{t('Last 7 days', 'آخر 7 أيام')}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold">{stats.last30Days}</div>
              <div className="text-xs text-muted-foreground">{t('Last 30 days', 'آخر 30 يوم')}</div>
            </CardContent>
          </Card>
        </div>

        {/* Add button */}
        <Button onClick={() => setShowForm(true)} className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          {t('Log a Meeting', 'تسجيل اجتماع')}
        </Button>

        {/* Form */}
        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle>{t('Log a Meeting', 'تسجيل اجتماع')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>{t('Meeting name', 'اسم الاجتماع')}</Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={t('e.g. Tuesday Night AA', 'مثال: اجتماع الثلاثاء')}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t('Type', 'النوع')}</Label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
                  >
                    {MEETING_TYPES.map((m) => (
                      <option key={m.value} value={m.value}>
                        {m.label[language]}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>{t('Date', 'التاريخ')}</Label>
                  <Input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t('Location (optional)', 'الموقع (اختياري)')}</Label>
                <Input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder={t('e.g. Community Center', 'مثال: المركز المجتمعي')}
                />
              </div>
              <div className="space-y-2">
                <Label>{t('Notes (optional)', 'ملاحظات (اختياري)')}</Label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  placeholder={t('What stood out?', 'ما الذي لفت انتباهك؟')}
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setShowForm(false)}>
                  {t('Cancel', 'إلغاء')}
                </Button>
                <Button className="flex-1" disabled={!title.trim() || saving} onClick={() => void logMeeting()}>
                  {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {t('Save', 'حفظ')}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Meeting list */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : meetings.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {t(
                  'No meetings logged yet. Start attending and track your progress.',
                  'لم تسجل أي اجتماعات بعد. ابدأ بالحضور وتتبع تقدمك.'
                )}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {meetings.map((meeting) => (
              <Card key={meeting.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold">{meeting.title}</h3>
                        <Badge variant="secondary">{getTypeLabel(meeting.type)}</Badge>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(meeting.date).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                        {meeting.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />
                            {meeting.location}
                          </span>
                        )}
                      </div>
                      {meeting.notes && (
                        <p className="mt-2 text-sm text-muted-foreground">{meeting.notes}</p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 shrink-0"
                      onClick={() => void deleteMeeting(meeting.id)}
                      aria-label={t('Delete', 'حذف')}
                    >
                      <Trash2 className="w-4 h-4 text-muted-foreground" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
      <CrisisButton />
    </div>
  )
}
