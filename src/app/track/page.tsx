'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { BottomNav } from '@/components/layout/BottomNav'
import { CrisisButton } from '@/components/layout/CrisisButton'
import { TrendingUp, Flame, Calendar, CheckCircle2, Plus, Save, Activity, Heart, Moon, Zap, Target, Award, BarChart3 } from 'lucide-react'

interface Checkin {
  id: string
  date: string
  mood: number
  energy: number
  stress: number
  triggers: string
  notes: string
  createdAt: string
}

export default function TrackPage() {
  const [language, setLanguage] = useState<'en' | 'ar'>('en')
  const [activeTab, setActiveTab] = useState('mood')
  const [checkIn, setCheckIn] = useState({
    mood: 5,
    energy: 5,
    cravings: 0,
    sleep: 7,
    notes: '',
    gratitude: '',
  })
  const [checkins, setCheckins] = useState<Checkin[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as 'en' | 'ar' | null
    if (savedLanguage) setLanguage(savedLanguage)

    const fetchCheckins = async () => {
      try {
        const res = await fetch('/api/checkin')
        if (!res.ok) throw new Error('Failed to fetch check-ins')
        const data = await res.json()
        if (data.success && data.checkins) {
          setCheckins(data.checkins)
        }
      } catch (err) {
        console.error('Error fetching check-ins:', err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchCheckins()
  }, [])

  const t = (en: string, ar: string) => language === 'en' ? en : ar

  const saveCheckIn = async () => {
    setIsSaving(true)
    try {
      const res = await fetch('/api/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mood: checkIn.mood,
          energy: checkIn.energy,
          stress: checkIn.cravings,
          triggers: [],
          notes: checkIn.notes,
        }),
      })
      if (!res.ok) throw new Error('Failed to save check-in')
      const data = await res.json()
      if (data.success && data.checkin) {
        setCheckins(prev => [data.checkin, ...prev])
      }
      setCheckIn({ mood: 5, energy: 5, cravings: 0, sleep: 7, notes: '', gratitude: '' })
    } catch (err) {
      console.error('Error saving check-in:', err)
    } finally {
      setIsSaving(false)
    }
  }

  const totalCheckIns = checkins.length
  const averageMood = checkins.length > 0 ? checkins.reduce((a, b) => a + b.mood, 0) / checkins.length : 0
  const averageEnergy = checkins.length > 0 ? checkins.reduce((a, b) => a + b.energy, 0) / checkins.length : 0

  const streak = (() => {
    if (checkins.length === 0) return 0
    const sorted = [...checkins].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    let count = 0
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    for (let i = 0; i < sorted.length; i++) {
      const checkinDate = new Date(sorted[i].date)
      checkinDate.setHours(0, 0, 0, 0)
      const expected = new Date(today)
      expected.setDate(expected.getDate() - i)
      if (checkinDate.getTime() === expected.getTime()) {
        count++
      } else {
        break
      }
    }
    return count
  })()

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <TrendingUp className="w-6 h-6" />
              {t('Track Progress', 'تتبع التقدم')}
            </h1>
            <p className="text-muted-foreground">
              {t('Monitor your recovery journey', 'راقب رحلة تعافيك')}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}>
            {language === 'en' ? 'العربية' : 'English'}
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('Current Streak', 'السلسلة الحالية')}</CardTitle>
              <Flame className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoading ? '—' : streak} {t('days', 'يوم')}</div>
              <p className="text-xs text-muted-foreground">{t('Longest: 45 days', 'أطول: 45 يوم')}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('Total Check-ins', 'إجمالي التسجيلات')}</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoading ? '—' : totalCheckIns}</div>
              <p className="text-xs text-muted-foreground">{t('Keep it up!', 'استمر!')}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('Avg Mood', 'متوسط المزاج')}</CardTitle>
              <Heart className="h-4 w-4 text-pink-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoading ? '—' : `${averageMood.toFixed(1)}/10`}</div>
              <Progress value={isLoading ? 0 : (averageMood / 10) * 100} className="h-2 mt-2" />
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="mood">{t('Mood Trends', 'اتجاهات المزاج')}</TabsTrigger>
            <TabsTrigger value="streak">{t('Streak Calendar', 'تقويم السلسلة')}</TabsTrigger>
            <TabsTrigger value="checkin">{t('Daily Check-in', 'التسجيل اليومي')}</TabsTrigger>
          </TabsList>

          <TabsContent value="mood" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Mood Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    {t('Weekly Mood', 'مزاج الأسبوع')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
                    </div>
                  ) : checkins.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">{t('No check-ins yet', 'لا توجد تسجيلات بعد')}</p>
                  ) : (
                    <div className="space-y-3">
                      {checkins.slice(0, 7).map((data) => {
                        const d = new Date(data.date)
                        const dayLabel = d.toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', { weekday: 'short' })
                        return (
                          <div key={data.id} className="flex items-center gap-3">
                            <span className="text-sm font-medium w-8">{dayLabel}</span>
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground w-12">{t('Mood', 'المزاج')}</span>
                                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                  <div className="h-full bg-pink-500 rounded-full" style={{ width: `${(data.mood / 10) * 100}%` }} />
                                </div>
                                <span className="text-xs w-6">{data.mood}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground w-12">{t('Energy', 'الطاقة')}</span>
                                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                  <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${(data.energy / 10) * 100}%` }} />
                                </div>
                                <span className="text-xs w-6">{data.energy}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground w-12">{t('Stress', 'الضغط')}</span>
                                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(data.stress / 10) * 100}%` }} />
                                </div>
                                <span className="text-xs w-6">{data.stress}</span>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Summary Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    {t('Weekly Summary', 'ملخص الأسبوع')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">{t('Average Mood', 'متوسط المزاج')}</span>
                        <span className="text-lg font-bold">{isLoading ? '—' : `${averageMood.toFixed(1)}/10`}</span>
                      </div>
                      <Progress value={isLoading ? 0 : (averageMood / 10) * 100} className="h-2" />
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">{t('Average Energy', 'متوسط الطاقة')}</span>
                        <span className="text-lg font-bold">{isLoading ? '—' : `${averageEnergy.toFixed(1)}/10`}</span>
                      </div>
                      <Progress value={isLoading ? 0 : (averageEnergy / 10) * 100} className="h-2" />
                    </div>
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <p className="text-sm text-green-700 dark:text-green-400">
                        {t('Great progress! Your mood has been consistently positive this week.', 'تقدم رائع! مزاجك كان إيجابياً باستمرار هذا الأسبوع.')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="streak" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  {t('Streak Calendar', 'تقويم السلسلة')}
                </CardTitle>
                <CardDescription>
                  {t('Your daily check-in history', 'سجل تسجيلك اليومي')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
                  </div>
                ) : checkins.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">{t('No check-ins yet', 'لا توجد تسجيلات بعد')}</p>
                ) : (
                  <div className="grid grid-cols-7 gap-2">
                    {checkins.slice(0, 28).map((day) => (
                      <div
                        key={day.id}
                        className="aspect-square rounded-lg flex items-center justify-center text-sm font-medium bg-green-500 text-white"
                      >
                        {new Date(day.date).getDate()}
                      </div>
                    ))}
                  </div>
                )}
                <div className="mt-4 flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-green-500" />
                    <span>{t('Completed', 'مكتمل')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-muted" />
                    <span>{t('Missed', 'فائت')}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="checkin" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  {t('Daily Check-in', 'التسجيل اليومي')}
                </CardTitle>
                <CardDescription>
                  {t('How are you feeling today?', 'كيف تشعر اليوم؟')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>{t('Mood (1-10)', 'المزاج (1-10)')}</Label>
                    <span className="text-sm font-medium">{checkIn.mood}/10</span>
                  </div>
                  <Slider
                    value={[checkIn.mood]}
                    onValueChange={([v]) => setCheckIn(prev => ({ ...prev, mood: v }))}
                    max={10}
                    step={1}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>{t('Energy Level (1-10)', 'مستوى الطاقة (1-10)')}</Label>
                    <span className="text-sm font-medium">{checkIn.energy}/10</span>
                  </div>
                  <Slider
                    value={[checkIn.energy]}
                    onValueChange={([v]) => setCheckIn(prev => ({ ...prev, energy: v }))}
                    max={10}
                    step={1}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>{t('Cravings (0-10)', 'الرغبات (0-10)')}</Label>
                    <span className="text-sm font-medium">{checkIn.cravings}/10</span>
                  </div>
                  <Slider
                    value={[checkIn.cravings]}
                    onValueChange={([v]) => setCheckIn(prev => ({ ...prev, cravings: v }))}
                    max={10}
                    step={1}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>{t('Sleep Hours', 'ساعات النوم')}</Label>
                    <span className="text-sm font-medium">{checkIn.sleep}h</span>
                  </div>
                  <Slider
                    value={[checkIn.sleep]}
                    onValueChange={([v]) => setCheckIn(prev => ({ ...prev, sleep: v }))}
                    max={12}
                    step={1}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t('Gratitude', 'الامتنان')}</Label>
                  <Textarea
                    placeholder={t('What are you grateful for today?', 'ما الذي تشكر عليه اليوم؟')}
                    value={checkIn.gratitude}
                    onChange={(e) => setCheckIn(prev => ({ ...prev, gratitude: e.target.value }))}
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t('Notes', 'ملاحظات')}</Label>
                  <Textarea
                    placeholder={t('Any thoughts or reflections...', 'أي أفكار أو تأملات...')}
                    value={checkIn.notes}
                    onChange={(e) => setCheckIn(prev => ({ ...prev, notes: e.target.value }))}
                    rows={3}
                  />
                </div>
                <Button onClick={saveCheckIn} className="w-full" disabled={isSaving}>
                  {isSaving ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  {isSaving ? t('Saving...', 'جاري الحفظ...') : t('Save Check-in', 'حفظ التسجيل')}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <BottomNav />
      <CrisisButton />
    </div>
  )
}
