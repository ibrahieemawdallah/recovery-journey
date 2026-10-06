'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { BottomNav } from '@/components/layout/BottomNav'
import { CrisisButton } from '@/components/layout/CrisisButton'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { User, Award, Target, Calendar, TrendingUp, BookOpen, Heart, Star, Edit, Settings, LogOut, ChevronRight, Flame, CheckCircle2, Clock, Activity, Sparkles, Medal, Trophy, Crown, Gem, Shield, Zap, Sun, Moon, Cloud, CloudRain, Wind, Droplets, Eye, Hand, Footprints, Music, Leaf, Anchor } from 'lucide-react'

interface UserData {
  id: string
  name: string
  email: string
  recoveryDate: string | null
  selectedGroup: string | null
  bio: string | null
  skills: string | null
  location: string | null
  isAvailable: boolean
  currentStreak: number
  longestStreak: number
  totalDays: number
  achievements: string
  dailyCheckins: unknown[]
  stepProgress: unknown[]
  gratitudeEntries: unknown[]
  journalEntries: unknown[]
  workTasks: unknown[]
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

const ACHIEVEMENTS = [
  { id: 'first-day', title: 'First Day', description: 'Started your recovery journey', icon: Sun, earned: false, date: null },
  { id: 'week-1', title: '1 Week Strong', description: 'Completed your first week', icon: Calendar, earned: false, date: null },
  { id: 'month-1', title: '30 Days', description: 'One month of sobriety', icon: Award, earned: false, date: null },
  { id: 'steps-6', title: 'Half Way There', description: 'Completed 6 steps', icon: BookOpen, earned: false, date: null },
  { id: 'month-3', title: '90 Days', description: 'Three months of sobriety', icon: Trophy, earned: false, date: null },
  { id: 'steps-12', title: 'All Steps', description: 'Completed all 12 steps', icon: Crown, earned: false, date: null },
  { id: 'month-6', title: '6 Months', description: 'Half a year of sobriety', icon: Gem, earned: false, date: null },
  { id: 'year-1', title: '1 Year', description: 'One year of sobriety', icon: Medal, earned: false, date: null },
]

const MOOD_HISTORY = [
  { month: 'Jan', average: 3.5 },
  { month: 'Feb', average: 4.0 },
  { month: 'Mar', average: 4.2 },
  { month: 'Apr', average: 4.5 },
  { month: 'May', average: 4.3 },
  { month: 'Jun', average: 4.7 },
]

export default function ProfilePage() {
  const [language, setLanguage] = useState<'en' | 'ar'>('en')
  const [userData, setUserData] = useState<UserData | null>(null)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [streak, setStreak] = useState(0)
  const [totalCheckIns, setTotalCheckIns] = useState(0)
  const [journalEntries, setJournalEntries] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [editForm, setEditForm] = useState({
    name: '',
    bio: '',
    recoveryDate: '',
    selectedGroup: '',
  })

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as 'en' | 'ar' | null
    if (savedLanguage) setLanguage(savedLanguage)

    const loadUser = async () => {
      try {
        const res = await fetch('/api/auth/me')
        const data = await res.json()
        if (data.success && data.user) {
          const user = data.user
          setUserData(user)
          setStreak(user.currentStreak || 0)
          setTotalCheckIns(user.dailyCheckins?.length || 0)
          setJournalEntries(user.journalEntries?.length || 0)
          setCompletedSteps(
            user.stepProgress
              ?.filter((s: { completed: boolean }) => s.completed)
              .map((s: { stepNumber: number }) => s.stepNumber) || []
          )
          setEditForm({
            name: user.name || '',
            bio: user.bio || '',
            recoveryDate: user.recoveryDate ? new Date(user.recoveryDate).toISOString().split('T')[0] : '',
            selectedGroup: user.selectedGroup || '',
          })
          fetchAchievements()
        }
      } catch (error) {
        console.error('Error fetching user:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadUser()
  }, [])

  const fetchUser = async (email: string) => {
    try {
      const res = await fetch(`/api/users?email=${encodeURIComponent(email)}`)
      if (!res.ok) throw new Error('Failed to fetch user')
      const data = await res.json()
      if (data.success && data.user) {
        const user = data.user
        setUserData(user)
        setStreak(user.currentStreak || 0)
        setTotalCheckIns(user.dailyCheckins?.length || 0)
        setJournalEntries(user.journalEntries?.length || 0)
        setCompletedSteps(
          user.stepProgress
            ?.filter((s: { completed: boolean }) => s.completed)
            .map((s: { stepNumber: number }) => s.stepNumber) || []
        )
        setEditForm({
          name: user.name || '',
          bio: user.bio || '',
          recoveryDate: user.recoveryDate ? new Date(user.recoveryDate).toISOString().split('T')[0] : '',
          selectedGroup: user.selectedGroup || '',
        })

        // Also fetch achievements for stats
        fetchAchievements(user.id)
      }
    } catch (error) {
      console.error('Error fetching user:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchAchievements = async () => {
    try {
      const res = await fetch('/api/achievements')
      if (!res.ok) throw new Error('Failed to fetch achievements')
      const data = await res.json()
      if (data.success && data.stats) {
        setStreak(data.stats.currentStreak || 0)
        setJournalEntries(data.stats.journalCount || 0)
        setCompletedSteps(Array.from({ length: data.stats.completedSteps || 0 }, (_, i) => i + 1))
      }
    } catch (error) {
      console.error('Error fetching achievements:', error)
    }
  }

  const handleSaveProfile = async () => {
    if (!userData?.email) return

    setIsSaving(true)
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userData.email,
          name: editForm.name,
          bio: editForm.bio,
          recoveryDate: editForm.recoveryDate || undefined,
          selectedGroup: editForm.selectedGroup || undefined,
        }),
      })
      if (!res.ok) throw new Error('Failed to save profile')
      const data = await res.json()
      if (data.success && data.user) {
        setUserData(data.user)
        setIsEditing(false)
      }
    } catch (error) {
      console.error('Error saving profile:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const t = (en: string, ar: string) => language === 'en' ? en : ar

  const daysSinceRecovery = userData?.recoveryDate
    ? Math.floor((new Date().getTime() - new Date(userData.recoveryDate).getTime()) / 86400000)
    : 0

  const earnedAchievements = ACHIEVEMENTS.filter(a => a.earned)
  const nextAchievement = ACHIEVEMENTS.find(a => !a.earned)

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
        {/* Profile Header */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <Avatar className="w-24 h-24">
                <AvatarFallback className="text-3xl bg-gradient-to-br from-primary to-accent-foreground text-white">
                  {userData?.name ? userData.name.charAt(0).toUpperCase() : <User className="w-10 h-10" />}
                </AvatarFallback>
              </Avatar>
              <div className="text-center md:text-left flex-1">
                <h1 className="text-2xl font-bold">{userData?.name || t('User', 'مستخدم')}</h1>
                <p className="text-muted-foreground">{userData?.email}</p>
                <div className="flex flex-wrap gap-2 mt-2 justify-center md:justify-start">
                  <Badge variant="secondary">
                    <Calendar className="w-3 h-3 mr-1" />
                    {t('Recovery since', 'التعافي منذ')} {userData?.recoveryDate ? new Date(userData.recoveryDate).toLocaleDateString() : t('Not set', 'غير محدد')}
                  </Badge>
                  <Badge variant="secondary">
                    <Flame className="w-3 h-3 mr-1" />
                    {streak} {t('day streak', 'يوم سلسلة')}
                  </Badge>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
                  <Edit className="w-4 h-4 mr-2" />
                  {t('Edit', 'تعديل')}
                </Button>
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Edit Profile Form */}
        {isEditing && (
          <Card>
            <CardHeader>
              <CardTitle>{t('Edit Profile', 'تعديل الملف الشخصي')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('Name', 'الاسم')}</label>
                <Input
                  value={editForm.name}
                  onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder={t('Your name', 'اسمك')}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('Bio', 'نبذة')}</label>
                <Textarea
                  value={editForm.bio}
                  onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder={t('Tell us about yourself', 'أخبرنا عن نفسك')}
                  className="min-h-[80px]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('Recovery Date', 'تاريخ التعافي')}</label>
                <Input
                  type="date"
                  value={editForm.recoveryDate}
                  onChange={(e) => setEditForm(prev => ({ ...prev, recoveryDate: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('Group', 'المجموعة')}</label>
                <Input
                  value={editForm.selectedGroup}
                  onChange={(e) => setEditForm(prev => ({ ...prev, selectedGroup: e.target.value }))}
                  placeholder={t('Your group', 'مجموعتك')}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSaveProfile} disabled={isSaving}>
                  {isSaving ? t('Saving...', 'جاري الحفظ...') : t('Save', 'حفظ')}
                </Button>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  {t('Cancel', 'إلغاء')}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('Days Sober', 'أيام الصحو')}</CardTitle>
              <Flame className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{daysSinceRecovery}</div>
              <Progress value={Math.min((daysSinceRecovery / 365) * 100, 100)} className="h-2 mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('Steps Done', 'الخطوات المكتملة')}</CardTitle>
              <BookOpen className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedSteps.length}/12</div>
              <Progress value={(completedSteps.length / 12) * 100} className="h-2 mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('Check-ins', 'التسجيلات')}</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCheckIns}</div>
              <p className="text-xs text-muted-foreground">{t('Total daily check-ins', 'إجمالي التسجيلات اليومية')}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('Journal Entries', 'إدخالات المفكرة')}</CardTitle>
              <Heart className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{journalEntries}</div>
              <p className="text-xs text-muted-foreground">{t('Personal reflections', 'تأملات شخصية')}</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="achievements" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="achievements">{t('Achievements', 'الإنجازات')}</TabsTrigger>
            <TabsTrigger value="activity">{t('Activity', 'النشاط')}</TabsTrigger>
            <TabsTrigger value="settings">{t('Settings', 'الإعدادات')}</TabsTrigger>
          </TabsList>

          <TabsContent value="achievements" className="space-y-4">
            {/* Next Achievement */}
            {nextAchievement && (
              <Card className="border-warning/40">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-warning">
                    <Trophy className="w-5 h-5" />
                    {t('Next Achievement', 'الإنجاز التالي')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-warning-muted flex items-center justify-center">
                      <nextAchievement.icon className="w-8 h-8 text-warning" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{nextAchievement.title}</h3>
                      <p className="text-sm text-muted-foreground">{nextAchievement.description}</p>
                      <Progress value={75} className="h-2 mt-2" />
                      <p className="text-xs text-muted-foreground mt-1">{t('75% complete', '75% مكتمل')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* All Achievements */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {ACHIEVEMENTS.map((achievement) => (
                <Card key={achievement.id} className={!achievement.earned ? 'opacity-50' : ''}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        achievement.earned
                          ? 'bg-warning-muted'
                          : 'bg-muted'
                      }`}>
                        <achievement.icon className={`w-6 h-6 ${
                          achievement.earned ? 'text-warning' : 'text-muted-foreground'
                        }`} />
                      </div>
                      <div>
                        <CardTitle className="text-base">{achievement.title}</CardTitle>
                        <CardDescription className="text-xs">{achievement.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {achievement.earned ? (
                      <Badge variant="secondary" className="bg-success-muted text-success">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        {t('Earned', 'مكتسب')}
                      </Badge>
                    ) : (
                      <Badge variant="outline">
                        {t('Locked', 'مقفل')}
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  {t('Mood Trend', 'اتجاه المزاج')}
                </CardTitle>
                <CardDescription>{t('Your average mood over the past 6 months', 'متوسط مزاجك خلال الأشهر الستة الماضية')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {MOOD_HISTORY.map((month) => (
                    <div key={month.month} className="flex items-center gap-3">
                      <span className="text-sm font-medium w-8">{month.month}</span>
                      <div className="flex-1">
                        <div className="h-3 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-primary to-accent-foreground rounded-full"
                            style={{ width: `${(month.average / 5) * 100}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground w-8">{month.average}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  {t('Recovery Summary', 'ملخص التعافي')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm">{t('Total days in recovery', 'إجمالي أيام التعافي')}</span>
                    <span className="font-bold">{daysSinceRecovery}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm">{t('Steps completed', 'الخطوات المكتملة')}</span>
                    <span className="font-bold">{completedSteps.length}/12</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm">{t('Achievements earned', 'الإنجازات المكتسبة')}</span>
                    <span className="font-bold">{earnedAchievements.length}/{ACHIEVEMENTS.length}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm">{t('Current streak', 'السلسلة الحالية')}</span>
                    <span className="font-bold">{streak} {t('days', 'يوم')}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t('Account Settings', 'إعدادات الحساب')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-between">
                  <span className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {t('Edit Profile', 'تعديل الملف الشخصي')}
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
                <Button variant="outline" className="w-full justify-between">
                  <span className="flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    {t('Preferences', 'التفضيلات')}
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
                <Button variant="outline" className="w-full justify-between">
                  <span className="flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    {t('Language', 'اللغة')}
                  </span>
                  <Badge variant="secondary">{language === 'en' ? 'English' : 'العربية'}</Badge>
                </Button>
                <Button variant="destructive" className="w-full justify-between">
                  <span className="flex items-center gap-2">
                    <LogOut className="w-4 h-4" />
                    {t('Sign Out', 'تسجيل الخروج')}
                  </span>
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
