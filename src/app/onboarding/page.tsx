'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Heart, ArrowRight, ArrowLeft, Check, Sparkles, Calendar, Users, Target, Mail, User } from 'lucide-react'
import { CalendarPicker } from '@/components/ui/calendar-picker'
import { LogoVideo } from '@/components/brand/logo-video'


const RECOVERY_GROUPS = [
  { id: 'early-recovery', name: 'Early Recovery (Days 1-30)', nameAr: 'التعافي المبكر (الأيام 1-30)' },
  { id: 'mid-recovery', name: 'Mid Recovery (Days 31-90)', nameAr: 'التعافي المتوسط (الأيام 31-90)' },
  { id: 'long-term', name: 'Long Term (90+ days)', nameAr: 'التعافي على المدى الطويل (90+ يوم)' },
  { id: 'young-adults', name: 'Young Adults (18-25)', nameAr: 'الشباب (18-25)' },
  { id: 'working-professionals', name: 'Working Professionals', nameAr: 'المهنيون العاملون' },
  { id: 'community-circle', name: 'Community Recovery Circle', nameAr: 'دائرة تعافي المجتمع' },
]

const SOBRIETY_GOALS = [
  { id: '30-days', name: '30 Days Sober', nameAr: '30 يوم من الصحو' },
  { id: '90-days', name: '90 Days Sober', nameAr: '90 يوم من الصحو' },
  { id: '6-months', name: '6 Months Sober', nameAr: '6 أشهر من الصحو' },
  { id: '1-year', name: '1 Year Sober', nameAr: 'سنة واحدة من الصحو' },
  { id: 'ongoing', name: 'Ongoing Recovery', nameAr: 'تعافي مستمر' },
]

const TOTAL_STEPS = 5

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [language, setLanguage] = useState<'en' | 'ar'>('en')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    recoveryDate: '',
    selectedGroup: '',
    sobrietyGoal: '',
    notes: '',
  })

  const t = (en: string, ar: string) => language === 'en' ? en : ar

  const updateForm = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const canProceed = () => {
    switch (step) {
      case 1: return formData.name.trim().length > 0
      case 2: return formData.email.trim().length > 0 && formData.email.includes('@')
      case 3: return formData.recoveryDate.length > 0
      case 4: return formData.selectedGroup.length > 0
      case 5: return formData.sobrietyGoal.length > 0
      default: return false
    }
  }

  const handleNext = () => {
    if (step < TOTAL_STEPS) setStep(step + 1)
    else handleComplete()
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleComplete = async () => {
    try {
      // Create the user in the database
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          recoveryDate: formData.recoveryDate,
          selectedGroup: formData.selectedGroup,
          preferences: { sobrietyGoal: formData.sobrietyGoal, notes: formData.notes },
        }),
      })
      const data = await response.json()
      if (!data.success) {
        console.error('Failed to create user:', data.error)
      }
    } catch (error) {
      console.error('Error creating user:', error)
    }

    localStorage.setItem('userId', formData.email)
    localStorage.setItem('onboardingData', JSON.stringify(formData))
    localStorage.setItem('language', language)
    // Full navigation — the session cookie arrives with the /api/users response,
    // and a client-side push can reach the middleware before it is stored.
    window.location.href = '/'
  }

  const progress = (step / TOTAL_STEPS) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent to-accent dark:from-foreground/10 dark:to-background flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="relative w-32 h-32">
              <div
                className="absolute -inset-4 rounded-[2rem] bg-[#BED68E]/30 blur-2xl"
                aria-hidden
              />
              <LogoVideo
                className="relative h-32 w-32 rounded-3xl bg-[#FAFAF8] p-1 ring-1 ring-[#444D47]/10 shadow-lg"
                ariaLabel={t('Recovery Journey logo', 'شعار رحلة التعافي')}
              />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">
            {t('Welcome to Recovery Journey', 'مرحباً بك في رحلة التعافي')}
          </CardTitle>
          <CardDescription>
            {t('Let\'s set up your profile together', 'دعنا نعد ملفك الشخصي معاً')}
          </CardDescription>
          <div className="flex items-center justify-between mt-4">
            <span className="text-sm text-muted-foreground">
              {t('Step', 'الخطوة')} {step} {t('of', 'من')} {TOTAL_STEPS}
            </span>
            <Button variant="ghost" size="sm" onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}>
              {language === 'en' ? 'العربية' : 'English'}
            </Button>
          </div>
          <Progress value={progress} className="h-2 mt-2" />
        </CardHeader>
        <CardContent className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <div className="text-center space-y-2">
                <User className="w-12 h-12 mx-auto text-primary" />
                <h3 className="text-lg font-semibold">{t('What\'s your name?', 'ما اسمك؟')}</h3>
                <p className="text-sm text-muted-foreground">
                  {t('We\'ll use this to personalize your experience', 'سنستخدمه لتخصيص تجربتك')}
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">{t('Full Name', 'الاسم الكامل')}</Label>
                <Input
                  id="name"
                  placeholder={t('Enter your name', 'أدخل اسمك')}
                  value={formData.name}
                  onChange={(e) => updateForm('name', e.target.value)}
                  className="text-lg"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="text-center space-y-2">
                <Mail className="w-12 h-12 mx-auto text-primary" />
                <h3 className="text-lg font-semibold">{t('Your Email', 'بريدك الإلكتروني')}</h3>
                <p className="text-sm text-muted-foreground">
                  {t('For account recovery and important updates', 'لاستعادة الحساب والتحديثات المهمة')}
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">{t('Email Address', 'عنوان البريد الإلكتروني')}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t('you@example.com', 'you@example.com')}
                  value={formData.email}
                  onChange={(e) => updateForm('email', e.target.value)}
                  className="text-lg"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="text-center space-y-2">
                <Calendar className="w-12 h-12 mx-auto text-primary" />
                <h3 className="text-lg font-semibold">{t('Recovery Start Date', 'تاريخ بدء التعافي')}</h3>
                <p className="text-sm text-muted-foreground">
                  {t('When did you begin your recovery journey?', 'متى بدأت رحلة التعافي؟')}
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="recoveryDate">{t('Date', 'التاريخ')}</Label>
                <CalendarPicker
                  value={formData.recoveryDate}
                  onChange={(v) => updateForm('recoveryDate', v)}
                  language={language}
                />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div className="text-center space-y-2">
                <Users className="w-12 h-12 mx-auto text-primary" />
                <h3 className="text-lg font-semibold">{t('Choose Your Group', 'اختر مجموعتك')}</h3>
                <p className="text-sm text-muted-foreground">
                  {t('Select the group that best fits your journey', 'اختر المجموعة التي تناسب رحلتك')}
                </p>
              </div>
              <div className="space-y-2">
                <Label>{t('Recovery Group', 'مجموعة التعافي')}</Label>
                <Select value={formData.selectedGroup} onValueChange={(v) => updateForm('selectedGroup', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('Select a group', 'اختر مجموعة')} />
                  </SelectTrigger>
                  <SelectContent>
                    {RECOVERY_GROUPS.map((group) => (
                      <SelectItem key={group.id} value={group.id}>
                        {t(group.name, group.nameAr)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4">
              <div className="text-center space-y-2">
                <Target className="w-12 h-12 mx-auto text-primary" />
                <h3 className="text-lg font-semibold">{t('Your Sobriety Goal', 'هدف الصحو الخاص بك')}</h3>
                <p className="text-sm text-muted-foreground">
                  {t('What milestone are you working toward?', 'ما الإنجاز الذي تعمل نحوه؟')}
                </p>
              </div>
              <div className="space-y-2">
                <Label>{t('Goal', 'الهدف')}</Label>
                <Select value={formData.sobrietyGoal} onValueChange={(v) => updateForm('sobrietyGoal', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('Select a goal', 'اختر هدفاً')} />
                  </SelectTrigger>
                  <SelectContent>
                    {SOBRIETY_GOALS.map((goal) => (
                      <SelectItem key={goal.id} value={goal.id}>
                        {t(goal.name, goal.nameAr)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">{t('Additional Notes (Optional)', 'ملاحظات إضافية (اختياري)')}</Label>
                <Textarea
                  id="notes"
                  placeholder={t('Any additional information...', 'أي معلومات إضافية...')}
                  value={formData.notes}
                  onChange={(e) => updateForm('notes', e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-4">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={step === 1}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('Back', 'رجوع')}
            </Button>
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="min-w-[120px]"
            >
              {step === TOTAL_STEPS ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  {t('Complete', 'إتمام')}
                </>
              ) : (
                <>
                  {t('Next', 'التالي')}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>

          <div className="flex justify-center gap-2">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i < step ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
