'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BottomNav } from '@/components/layout/BottomNav'
import { CrisisButton } from '@/components/layout/CrisisButton'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Heart, MessageCircle, Wind, Brain, Shield, BookOpen, Target, TrendingUp, Flame, Users, Star, ArrowRight, Sparkles, Calendar, Award, Clock, CheckCircle2, Activity } from 'lucide-react'

const QUICK_ACTIONS = [
  { id: 'checkin', title: 'Daily Check-in', icon: CheckCircle2, color: 'bg-success', href: '/track' },
  { id: 'journal', title: 'Write Journal', icon: Sparkles, color: 'bg-primary/70', href: '/journal' },
  { id: 'breathe', title: 'Breathe', icon: Wind, color: 'bg-accent-foreground', href: '/tools' },
  { id: 'chat', title: 'AI Coach', icon: MessageCircle, color: 'bg-primary', href: '/chat' },
]

interface Goal {
  id: string
  title: string
  completed: boolean
  priority: string
  date: string
}

interface Gratitude {
  id: string
  entry: string
  createdAt: string
}

interface AchievementStats {
  completedSteps: number
  journalCount: number
  gratitudeCount: number
  completedGoals: number
  currentStreak: number
  longestStreak: number
  totalDays: number
}

export default function DashboardPage() {
  const router = useRouter()
  const [language, setLanguage] = useState<'en' | 'ar'>('en')
  const [userData, setUserData] = useState({ name: '', recoveryDate: '' })
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [streak, setStreak] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isChecking, setIsChecking] = useState(false)
  const [currentStep, setCurrentStep] = useState<{ stepNumber: number; tasksDone: number; tasksTotal: number } | null>(null)
  const [nextStep, setNextStep] = useState<number | null>(null)
  const [goals, setGoals] = useState<Goal[]>([])
  const [gratitudes, setGratitudes] = useState<Gratitude[]>([])
  const [achievementStats, setAchievementStats] = useState<AchievementStats | null>(null)
  const [newGoalTitle, setNewGoalTitle] = useState('')
  const [newGoalPriority, setNewGoalPriority] = useState<'low' | 'medium' | 'high'>('medium')
  const [newGratitudeEntry, setNewGratitudeEntry] = useState('')
  const [isAddingGoal, setIsAddingGoal] = useState(false)
  const [isAddingGratitude, setIsAddingGratitude] = useState(false)

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as 'en' | 'ar' | null
    if (savedLanguage) setLanguage(savedLanguage)

    const onboardingData = localStorage.getItem('onboardingData')
    if (onboardingData) {
      const data = JSON.parse(onboardingData)
      setUserData({ name: data.name || '', recoveryDate: data.recoveryDate || '' })
    }

    const savedSteps = localStorage.getItem('completedSteps')
    if (savedSteps) setCompletedSteps(JSON.parse(savedSteps))

    // Fetch current user from session
    const loadUser = async () => {
      try {
        const res = await fetch('/api/auth/me')
        const data = await res.json()
        if (data.success && data.user) {
          fetchGoals()
          fetchGratitudes()
          fetchAchievements()
          fetchStepProgress()
        }
      } catch (error) {
        console.error('Error loading user:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadUser()
  }, [])

  const fetchStepProgress = async () => {
    try {
      const res = await fetch('/api/checkin')
      if (!res.ok) return
      const data = await res.json()
      if (data.success) {
        setCurrentStep(data.currentStep ?? null)
        setNextStep(data.nextStep?.stepNumber ?? null)
      }
    } catch (error) {
      console.error('Error fetching step progress:', error)
    }
  }

  const fetchGoals = async () => {
    try {
      const res = await fetch('/api/goals')
      if (!res.ok) return
      const data = await res.json()
      if (data.success) setGoals(data.goals ?? [])
    } catch (error) {
      console.error('Error fetching goals:', error)
    }
  }

  const fetchGratitudes = async () => {
    try {
      const res = await fetch('/api/gratitude')
      if (!res.ok) return
      const data = await res.json()
      if (data.success) setGratitudes(data.gratitudes ?? [])
    } catch (error) {
      console.error('Error fetching gratitude entries:', error)
    }
  }

  const fetchAchievements = async () => {
    try {
      const res = await fetch('/api/achievements')
      if (!res.ok) return
      const data = await res.json()
      if (data.success) {
        const stats = data.stats ?? {}
        setAchievementStats({
          completedSteps: stats.completedSteps ?? 0,
          journalCount: stats.journalCount ?? 0,
          gratitudeCount: stats.gratitudeCount ?? 0,
          completedGoals: stats.completedGoals ?? 0,
          currentStreak: stats.currentStreak ?? 0,
          longestStreak: stats.longestStreak ?? 0,
          totalDays: stats.totalDays ?? 0,
        })
        setStreak(stats.currentStreak ?? 0)
      }
    } catch (error) {
      console.error('Error fetching achievements:', error)
    }
  }

  const handleCheckIn = async (step?: number) => {
    setIsChecking(true)
    try {
      const res = await fetch('/api/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stepNumber: step ?? undefined }),
      })
      if (res.ok) {
        const data = await res.json()
        if (data.success && data.checkin) {
          setCurrentStep(data.currentStep ?? null)
          setNextStep(data.nextStep?.stepNumber ?? null)
          if (step) {
            void router.push(`/steps?step=${step}`)
          }
        }
      }
    } catch (error) {
      console.error('Error creating check-in:', error)
    } finally {
      setIsChecking(false)
    }
  }

  const handleAddGoal = async () => {
    if (!newGoalTitle.trim()) return

    setIsAddingGoal(true)
    try {
      const res = await fetch('/api/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newGoalTitle.trim(), priority: newGoalPriority }),
      })
      if (!res.ok) throw new Error('Failed to add goal')
      const data = await res.json()
      if (data.success) {
        setGoals(prev => [data.goal, ...prev])
        setNewGoalTitle('')
        setNewGoalPriority('medium')
      }
    } catch (error) {
      console.error('Error adding goal:', error)
    } finally {
      setIsAddingGoal(false)
    }
  }

  const handleToggleGoal = async (goal: Goal) => {
    try {
      const res = await fetch('/api/goals', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: goal.id, completed: !goal.completed }),
      })
      if (!res.ok) throw new Error('Failed to update goal')
      const data = await res.json()
      if (data.success) {
        setGoals(prev => prev.map(g => g.id === goal.id ? data.goal : g))
      }
    } catch (error) {
      console.error('Error updating goal:', error)
    }
  }

  const handleAddGratitude = async () => {
    if (!newGratitudeEntry.trim()) return

    setIsAddingGratitude(true)
    try {
      const res = await fetch('/api/gratitude', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entry: newGratitudeEntry.trim() }),
      })
      if (!res.ok) throw new Error('Failed to add gratitude')
      const data = await res.json()
      if (data.success) {
        setGratitudes(prev => [data.gratitude, ...prev])
        setNewGratitudeEntry('')
      }
    } catch (error) {
      console.error('Error adding gratitude:', error)
    } finally {
      setIsAddingGratitude(false)
    }
  }

  const t = (en: string, ar: string) => language === 'en' ? en : ar

  const daysSinceRecovery = userData.recoveryDate
    ? Math.floor((new Date().getTime() - new Date(userData.recoveryDate).getTime()) / 86400000)
    : 0

  const sobrietyProgress = Math.min((daysSinceRecovery / 365) * 100, 100)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent-foreground rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <p className="text-muted-foreground">{t('Loading...', 'جاري التحميل...')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              {t('Dashboard', 'لوحة التحكم')}
            </h1>
            <p className="text-muted-foreground">
              {t('Your recovery at a glance', 'تعافيك في لمحة')}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}>
            {language === 'en' ? 'العربية' : 'English'}
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('Days Sober', 'أيام الصحو')}</CardTitle>
              <Flame className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{daysSinceRecovery}</div>
              <p className="text-xs text-muted-foreground">{t('Keep it up!', 'استمر!')}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('Current Streak', 'السلسلة الحالية')}</CardTitle>
              <Activity className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{streak} {t('days', 'يوم')}</div>
              <p className="text-xs text-muted-foreground">{t('Personal best: 45', 'أفضل رقم: 45')}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('Steps Completed', 'الخطوات المكتملة')}</CardTitle>
              <BookOpen className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedSteps.length}/12</div>
              <Progress value={(completedSteps.length / 12) * 100} className="h-2 mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('Sobriety Goal', 'هدف الصحو')}</CardTitle>
              <Target className="h-4 w-4 text-accent-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(sobrietyProgress)}%</div>
              <Progress value={sobrietyProgress} className="h-2 mt-2" />
            </CardContent>
          </Card>
        </div>

        {/* Check-in + Step Spotlight */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              {t('Check-in & Step Spotlight', 'التدقيق والخطوة الأساسية')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentStep ? (
              <div className="p-3 rounded-lg bg-primary/5">
                <p className="text-sm font-medium">{t('You are on Step', 'أنت على الخطوة')} {currentStep.stepNumber}</p>
                <p className="text-sm text-muted-foreground">
                  {t('Progress', 'التقدم')} {currentStep.tasksDone}/{currentStep.tasksTotal}
                </p>
                {nextStep && nextStep !== currentStep.stepNumber && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => handleCheckIn(nextStep)}
                  >
                    <ArrowRight className="w-4 h-4 mr-2" />
                    {t('Go to Step', 'انتقل للخطوة')} {nextStep}
                  </Button>
                )}
              </div>
            ) : (
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">{t('No check-in yet today', 'لم تحضر دخول اليوم')}</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => handleCheckIn()}
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  {t('Do check-in now', 'أداء تدقيق اليوم')}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              {t('Quick Actions', 'إجراءات سريعة')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {QUICK_ACTIONS.map((action) => (
                <Button
                  key={action.id}
                  variant="outline"
                  className="h-auto py-4 flex flex-col items-center gap-2"
                  onClick={() => router.push(action.href)}
                >
                  <div className={`w-10 h-10 rounded-full ${action.color} flex items-center justify-center`}>
                    <action.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm font-medium">{t(action.title, action.title)}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Daily Goals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              {t('Daily Goals', 'الأهداف اليومية')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder={t('Add a new goal...', 'أضف هدفًا جديدًا...')}
                value={newGoalTitle}
                onChange={(e) => setNewGoalTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddGoal()}
              />
              <Button onClick={handleAddGoal} disabled={isAddingGoal || !newGoalTitle.trim()}>
                {t('Add', 'إضافة')}
              </Button>
            </div>
            {goals.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t('No goals yet. Add your first goal!', 'لا توجد أهداف بعد. أضف هدفك الأول!')}</p>
            ) : (
              <div className="space-y-2">
                {goals.map((goal) => (
                  <div key={goal.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <button
                      onClick={() => handleToggleGoal(goal)}
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        goal.completed
                          ? 'bg-success border-success text-white'
                          : 'border-muted-foreground'
                      }`}
                    >
                      {goal.completed && <CheckCircle2 className="w-3 h-3" />}
                    </button>
                    <span className={`flex-1 text-sm ${goal.completed ? 'line-through text-muted-foreground' : ''}`}>
                      {goal.title}
                    </span>
                    <Badge variant={goal.priority === 'high' ? 'destructive' : goal.priority === 'medium' ? 'default' : 'secondary'}>
                      {goal.priority}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Gratitude */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5" />
              {t('Gratitude', 'الامتنان')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Textarea
                placeholder={t('What are you grateful for today?', 'ما الذي تشكر عليه اليوم؟')}
                value={newGratitudeEntry}
                onChange={(e) => setNewGratitudeEntry(e.target.value)}
                className="min-h-[60px]"
              />
              <Button onClick={handleAddGratitude} disabled={isAddingGratitude || !newGratitudeEntry.trim()}>
                {t('Add', 'إضافة')}
              </Button>
            </div>
            {gratitudes.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t('No gratitude entries yet. Add your first!', 'لا توجد إدخالات امتنان بعد. أضف أول إدخال!')}</p>
            ) : (
              <div className="space-y-2">
                {gratitudes.slice(0, 10).map((gratitude) => (
                  <div key={gratitude.id} className="p-3 rounded-lg bg-muted/50">
                    <p className="text-sm">{gratitude.entry}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(gratitude.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="activity" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="activity">{t('Activity', 'النشاط')}</TabsTrigger>
            <TabsTrigger value="progress">{t('Progress', 'التقدم')}</TabsTrigger>
            <TabsTrigger value="insights">{t('Insights', 'رؤى')}</TabsTrigger>
          </TabsList>

          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  {t('Recent Activity', 'النشاط الأخير')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {goals.filter(g => g.completed).slice(0, 5).map((goal) => (
                    <div key={goal.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-success">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{t('Goal completed:', 'هدف مكتمل:')} {goal.title}</p>
                        <p className="text-xs text-muted-foreground">{new Date(goal.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                  {gratitudes.slice(0, 5).map((gratitude) => (
                    <div key={gratitude.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-accent-foreground">
                        <Heart className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{t('Gratitude entry:', 'إدخال امتنان:')} {gratitude.entry}</p>
                        <p className="text-xs text-muted-foreground">{new Date(gratitude.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                  {goals.filter(g => g.completed).length === 0 && gratitudes.length === 0 && (
                    <p className="text-sm text-muted-foreground">{t('No recent activity', 'لا يوجد نشاط حديث')}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="progress" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    {t('Weekly Mood', 'مزاج الأسبوع')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                      <div key={day} className="flex items-center gap-3">
                        <span className="text-sm font-medium w-8">{day}</span>
                        <div className="flex-1">
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-primary to-accent-foreground rounded-full"
                              style={{ width: `${((i + 1) / 7) * 100}%` }}
                            />
                          </div>
                        </div>
                        <span className="text-sm text-muted-foreground w-6">{Math.round(((i + 1) / 7) * 5)}/5</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    {t('Milestones', 'الإنجازات')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { days: 7, label: '1 Week', achieved: daysSinceRecovery >= 7 },
                      { days: 30, label: '30 Days', achieved: daysSinceRecovery >= 30 },
                      { days: 60, label: '60 Days', achieved: daysSinceRecovery >= 60 },
                      { days: 90, label: '90 Days', achieved: daysSinceRecovery >= 90 },
                      { days: 180, label: '6 Months', achieved: daysSinceRecovery >= 180 },
                      { days: 365, label: '1 Year', achieved: daysSinceRecovery >= 365 },
                    ].map((milestone) => (
                      <div key={milestone.days} className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          milestone.achieved ? 'bg-warning-muted text-warning' : 'bg-muted text-muted-foreground'
                        }`}>
                          <Award className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{milestone.label}</p>
                        </div>
                        {milestone.achieved && (
                          <Badge variant="secondary" className="bg-success-muted text-success">
                            {t('Achieved', 'تم الإنجاز')}
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  {t('Recovery Insights', 'رؤى التعافي')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-primary/5 rounded-lg">
                    <p className="font-medium text-sm">{t('Mood Trend', 'اتجاه المزاج')}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {t('Your mood has been steadily improving over the past week. Keep up the great work!', 'مزاجك يتحسن بثبات خلال الأسبوع الماضي. استمر في العمل الرائع!')}
                    </p>
                  </div>
                  <div className="p-4 bg-primary/5 rounded-lg">
                    <p className="font-medium text-sm">{t('Craving Patterns', 'أنماط الرغبة')}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {t('Cravings tend to peak in the evening. Consider scheduling activities during this time.', 'تميل الرغبات للذروة في المساء. فكر في جدولة أنشطة خلال هذا الوقت.')}
                    </p>
                  </div>
                  <div className="p-4 bg-primary/5 rounded-lg">
                    <p className="font-medium text-sm">{t('Recommendation', 'توصية')}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {t('You\'re making excellent progress on Step 4. Consider moving to Step 5 when ready.', 'أنت تقدم تقدماً ممتازاً في الخطوة 4. فكر في الانتقال للخطوة 5 عندما تكون مستعداً.')}
                    </p>
                  </div>
                </div>
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
