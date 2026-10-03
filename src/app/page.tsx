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
import { SobrietyCounter } from '@/components/dashboard/SobrietyCounter'
import { QuickActions } from '@/components/dashboard/QuickActions'
import { StatsOverview } from '@/components/dashboard/StatsOverview'
import { DailyQuote } from '@/components/dashboard/DailyQuote'
import { Heart, MessageCircle, Wind, Brain, Shield, BookOpen, Target, TrendingUp, Flame, Users, Star, ArrowRight } from 'lucide-react'
import { BrandMark } from '@/components/brand/brand-mark'
import { LogoVideo } from '@/components/brand/logo-video'

const TWELVE_STEPS = [
  { number: 1, title: 'We admitted we were powerless over addiction', shortTitle: 'Powerlessness' },
  { number: 2, title: 'Came to believe a Power greater than ourselves could restore us', shortTitle: 'Hope' },
  { number: 3, title: 'Made a decision to turn our will over to God', shortTitle: 'Surrender' },
  { number: 4, title: 'Made a searching and fearless moral inventory', shortTitle: 'Inventory' },
  { number: 5, title: 'Admitted to God, ourselves, and another person the exact nature of our wrongs', shortTitle: 'Confession' },
  { number: 6, title: 'Were entirely ready to have God remove our defects of character', shortTitle: 'Readiness' },
  { number: 7, title: 'Humbly asked God to remove our shortcomings', shortTitle: 'Humility' },
  { number: 8, title: 'Made a list of all persons we had harmed and became willing to make amends', shortTitle: 'Amends List' },
  { number: 9, title: 'Made direct amends wherever possible', shortTitle: 'Amends' },
  { number: 10, title: 'Continued to take personal inventory and promptly admitted when wrong', shortTitle: 'Maintenance' },
  { number: 11, title: 'Sought through prayer and meditation to improve our conscious contact with God', shortTitle: 'Prayer' },
  { number: 12, title: 'Carried the message to others and practiced these principles in all our affairs', shortTitle: 'Service' },
]

export default function HomePage() {
  const router = useRouter()
  const [isOnboarded, setIsOnboarded] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [language, setLanguage] = useState<'en' | 'ar'>('en')
  const [activeTab, setActiveTab] = useState('home')
  const [userData, setUserData] = useState({ name: '', recoveryDate: '', selectedGroup: '' })
  const [completedSteps, setCompletedSteps] = useState<number[]>([])

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as 'en' | 'ar' | null
    if (savedLanguage) setLanguage(savedLanguage)

    const loadUser = async () => {
      try {
        const res = await fetch('/api/auth/me')
        const data = await res.json()
        if (data.success && data.user) {
          setUserData({
            name: data.user.name || '',
            recoveryDate: data.user.recoveryDate ? data.user.recoveryDate.split('T')[0] : '',
            selectedGroup: data.user.selectedGroup || '',
          })
          setIsOnboarded(true)
        } else {
          setIsOnboarded(false)
        }
      } catch (error) {
        console.error('Error loading user:', error)
        setIsOnboarded(false)
      } finally {
        setIsLoading(false)
      }
    }
    loadUser()
  }, [])

  const loadUserData = async (userId: string) => {
    try {
      const response = await fetch(`/api/users?email=${userId}`)
      const data = await response.json()
      if (data.success && data.user) {
        setUserData({
          name: data.user.name || '',
          recoveryDate: data.user.recoveryDate ? data.user.recoveryDate.split('T')[0] : '',
          selectedGroup: data.user.selectedGroup || '',
        })
        setIsOnboarded(true)
      } else {
        // User not found in database — clear stale ID and show onboarding
        localStorage.removeItem('userId')
        setIsOnboarded(false)
      }
    } catch (error) {
      console.error('Error loading user data:', error)
      localStorage.removeItem('userId')
      setIsOnboarded(false)
    } finally {
      setIsLoading(false)
    }
  }

  const t = (en: string, ar: string) => language === 'en' ? en : ar

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mb-4 mx-auto">
            <div className="absolute -inset-3 rounded-2xl bg-emerald-400/25 blur-xl animate-pulse" aria-hidden />
            <BrandMark className="relative h-16 w-16" title={t('Recovery Journey logo', 'شعار رحلة التعافي')} />
          </div>
          <p className="text-muted-foreground">{t('Loading...', 'جاري التحميل...')}</p>
        </div>
      </div>
    )
  }

  if (!isOnboarded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-lg">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="relative w-28 h-28">
                <div className="absolute -inset-4 rounded-[2rem] bg-emerald-400/20 blur-2xl animate-pulse" aria-hidden />
                <LogoVideo
                  className="relative h-28 w-28 rounded-3xl ring-1 ring-emerald-500/20 shadow-xl shadow-emerald-900/10"
                  ariaLabel={t('Recovery Journey logo', 'شعار رحلة التعافي')}
                />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold">{t('Recovery Journey', 'رحلة التعافي')}</CardTitle>
            <CardDescription className="text-lg">{t('Your path to freedom starts here', 'طريقك نحو الحرية يبدأ هنا')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <p className="text-muted-foreground">{t('A comprehensive recovery companion with AI coaching, clinical tools, community support, and evidence-based programs.', 'رفيق تعافي شامل مع مدرب ذكي وأدوات سريرية ودعم مجتمعي وبرامج قائمة على الأدلة.')}</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-primary/5 rounded-lg"><BookOpen className="w-6 h-6 text-primary mx-auto mb-2" /><p className="text-sm font-medium">{t('12 Steps', 'الخطوات ١٢')}</p></div>
                <div className="p-3 bg-primary/5 rounded-lg"><MessageCircle className="w-6 h-6 text-primary mx-auto mb-2" /><p className="text-sm font-medium">{t('AI Coach', 'المدرب الذكي')}</p></div>
                <div className="p-3 bg-primary/5 rounded-lg"><Brain className="w-6 h-6 text-primary mx-auto mb-2" /><p className="text-sm font-medium">{t('Clinical Tools', 'الأدوات السريرية')}</p></div>
                <div className="p-3 bg-primary/5 rounded-lg"><Users className="w-6 h-6 text-primary mx-auto mb-2" /><p className="text-sm font-medium">{t('Community', 'المجتمع')}</p></div>
              </div>
            </div>
            <Button size="lg" className="w-full text-lg" onClick={() => router.push('/onboarding')}>
              {t('Start Your Journey', 'ابدأ رحلتك')}<ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <div className="flex justify-center">
              <Button variant="ghost" size="sm" onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}>
                {language === 'en' ? 'العربية' : 'English'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">{t('Welcome back', 'مرحباً بعودتك')}{userData.name ? `, ${userData.name}` : ''}</h1>
            <p className="text-muted-foreground">{t('Your recovery journey continues', 'رحلة التعافي مستمرة')}</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}>
            {language === 'en' ? 'العربية' : 'English'}
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
            <TabsTrigger value="home">Home</TabsTrigger>
            <TabsTrigger value="steps">Steps</TabsTrigger>
            <TabsTrigger value="tools">Tools</TabsTrigger>
            <TabsTrigger value="track">Track</TabsTrigger>
            <TabsTrigger value="more">More</TabsTrigger>
          </TabsList>

          <TabsContent value="home" className="space-y-6">
            <SobrietyCounter startDate={userData.recoveryDate || '2024-01-01'} />
            <QuickActions />
            <StatsOverview />
            <DailyQuote />
          </TabsContent>

          <TabsContent value="steps" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><BookOpen className="w-5 h-5" />{t('12 Steps', 'الخطوات ١٢')}</CardTitle>
                <CardDescription>{t('Work through the 12 steps at your own pace', 'اعمل على الخطوات الـ ١٢ بالوتيرة اللي تناسبك')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{t('Progress', 'التقدم')}</span>
                    <span className="text-sm text-muted-foreground">{completedSteps.length}/12</span>
                  </div>
                  <Progress value={(completedSteps.length / 12) * 100} className="h-2" />
                </div>
                <div className="space-y-2">
                  {TWELVE_STEPS.map((step) => (
                    <div key={step.number} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${completedSteps.includes(step.number) ? 'bg-green-500 text-white' : 'bg-muted text-muted-foreground'}`}>{step.number}</div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{step.shortTitle}</p>
                        <p className="text-xs text-muted-foreground">{step.title}</p>
                      </div>
                      {completedSteps.includes(step.number) && <Badge variant="secondary" className="bg-green-100 text-green-700">{t('Done', 'تم')}</Badge>}
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4" onClick={() => router.push('/steps')}>
                  {t('View All Steps', 'عرض كل الخطوات')}<ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tools" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><Wind className="w-5 h-5" />{t('Breathing Exercises', 'تمارين التنفس')}</CardTitle><CardDescription>{t('Guided breathing for calm and focus', 'تنفس موجه للهدوء والتركيز')}</CardDescription></CardHeader>
                <CardContent><Button variant="outline" className="w-full" onClick={() => router.push('/tools')}>{t('Start Exercise', 'ابدأ التمرين')}</Button></CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><Brain className="w-5 h-5" />{t('Clinical Tools', 'الأدوات السريرية')}</CardTitle><CardDescription>{t('CBT/DBT exercises and thought records', 'تمارين CBT/DBT وسجلات الأفكار')}</CardDescription></CardHeader>
                <CardContent><Button variant="outline" className="w-full" onClick={() => router.push('/clinical')}>{t('Open Tools', 'افتح الأدوات')}</Button></CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><MessageCircle className="w-5 h-5" />{t('AI Recovery Coach', 'مدرب التعافي الذكي')}</CardTitle><CardDescription>{t('Chat with your AI-powered recovery companion', 'تحدث مع رفيق التعافي الذكي')}</CardDescription></CardHeader>
                <CardContent><Button variant="outline" className="w-full" onClick={() => router.push('/chat')}>{t('Start Chat', 'ابدأ المحادثة')}</Button></CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><Shield className="w-5 h-5" />{t('Crisis Support', 'دعم الأزمات')}</CardTitle><CardDescription>{t('Immediate help and emergency resources', 'مساعدة فورية وموارد الطوارئ')}</CardDescription></CardHeader>
                <CardContent><Button variant="destructive" className="w-full">{t('Get Help Now', 'احصل على المساعدة الآن')}</Button></CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="track" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp className="w-5 h-5" />{t('Mood Trends', 'اتجاهات المزاج')}</CardTitle><CardDescription>{t('Track your mood over time', 'تتبع مزاجك بمرور الوقت')}</CardDescription></CardHeader>
                <CardContent><div className="text-center py-8 text-muted-foreground"><TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" /><p>{t('Complete daily check-ins to see trends', 'أكمل التسجيل اليومي لرؤية الاتجاهات')}</p></div></CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><Flame className="w-5 h-5" />{t('Streak Progress', 'تقدم السلسلة')}</CardTitle><CardDescription>{t('Your current and longest streaks', 'سلاسلك الحالية وأطولها')}</CardDescription></CardHeader>
                <CardContent><div className="text-center py-8 text-muted-foreground"><Flame className="w-12 h-12 mx-auto mb-4 opacity-50" /><p>{t('Streak tracking will appear here', 'تتبع السلسلة سيظهر هنا')}</p></div></CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="more" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><BookOpen className="w-5 h-5" />{t('Journal', 'المفكرة')}</CardTitle><CardDescription>{t('Personal journal and gratitude tracking', 'مفكرة شخصية وتتبع الامتنان')}</CardDescription></CardHeader>
                <CardContent><Button variant="outline" className="w-full" onClick={() => router.push('/journal')}>{t('Open Journal', 'افتح المفكرة')}</Button></CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><Target className="w-5 h-5" />{t('Goals', 'الأهداف')}</CardTitle><CardDescription>{t('Daily goals and achievements', 'الأهداف اليومية والإنجازات')}</CardDescription></CardHeader>
                <CardContent><Button variant="outline" className="w-full" onClick={() => router.push('/dashboard')}>{t('View Goals', 'عرض الأهداف')}</Button></CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><Star className="w-5 h-5" />{t('Resources', 'المصادر')}</CardTitle><CardDescription>{t('Articles, guides, and recovery materials', 'مقالات وأدلة ومواد التعافي')}</CardDescription></CardHeader>
                <CardContent><Button variant="outline" className="w-full" onClick={() => router.push('/resources')}>{t('Browse Resources', 'تصفح المصادر')}</Button></CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><Users className="w-5 h-5" />{t('Profile', 'الملف الشخصي')}</CardTitle><CardDescription>{t('Manage your profile and settings', 'إدارة ملفك الشخصي والإعدادات')}</CardDescription></CardHeader>
                <CardContent><Button variant="outline" className="w-full" onClick={() => router.push('/profile')}>{t('View Profile', 'عرض الملف الشخصي')}</Button></CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <BottomNav />
      <CrisisButton />
    </div>
  )
}
