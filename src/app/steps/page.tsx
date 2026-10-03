'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { BottomNav } from '@/components/layout/BottomNav'
import { CrisisButton } from '@/components/layout/CrisisButton'
import { BookOpen, Check, ChevronDown, ChevronUp, Sparkles, Award, Lock, Circle } from 'lucide-react'

const TWELVE_STEPS = [
  { number: 1, title: 'We admitted we were powerless over addiction—that our lives had become unmanageable.', shortTitle: 'Powerlessness', description: 'The first step is recognizing that addiction has made our lives unmanageable. This admission is the foundation of recovery.' },
  { number: 2, title: 'Came to believe that a Power greater than ourselves could restore us to sanity.', shortTitle: 'Hope', description: 'We begin to believe that recovery is possible and that help is available from a higher power, however we understand it.' },
  { number: 3, title: 'Made a decision to turn our will and our lives over to the care of God as we understood Him.', shortTitle: 'Surrender', description: 'We make a conscious decision to trust a higher power and let go of the need to control everything.' },
  { number: 4, title: 'Made a searching and fearless moral inventory of ourselves.', shortTitle: 'Inventory', description: 'We take an honest look at our strengths and weaknesses, our resentments, and our character defects.' },
  { number: 5, title: 'Admitted to God, to ourselves, and to another human being the exact nature of our wrongs.', shortTitle: 'Confession', description: 'We share our moral inventory with a trusted person, practicing honesty and vulnerability.' },
  { number: 6, title: 'Were entirely ready to have God remove all these defects of character.', shortTitle: 'Readiness', description: 'We become willing to let go of our character defects and negative patterns.' },
  { number: 7, title: 'Humbly asked Him to remove our shortcomings.', shortTitle: 'Humility', description: 'We ask our higher power to help us overcome our limitations and character defects.' },
  { number: 8, title: 'Made a list of all persons we had harmed, and became willing to make amends to them all.', shortTitle: 'Amends List', description: 'We identify people we have harmed and become willing to make things right.' },
  { number: 9, title: 'Made direct amends to such people wherever possible, except when to do so would injure them or others.', shortTitle: 'Amends', description: 'We take action to repair the harm we have caused, when it is safe and appropriate.' },
  { number: 10, title: 'Continued to take personal inventory and when we were wrong promptly admitted it.', shortTitle: 'Maintenance', description: 'We continue to monitor our behavior and quickly acknowledge when we make mistakes.' },
  { number: 11, title: 'Sought through prayer and meditation to improve our conscious contact with God as we understood Him, praying only for knowledge of His will for us and the power to carry that out.', shortTitle: 'Prayer', description: 'We deepen our spiritual connection through prayer and meditation, seeking guidance and strength.' },
  { number: 12, title: 'Having had a spiritual awakening as the result of these steps, we tried to carry this message to others, and to practice these principles in all our affairs.', shortTitle: 'Service', description: 'We share our experience with others and continue to apply these principles in our daily lives.' },
]

export default function StepsPage() {
  const [language, setLanguage] = useState<'en' | 'ar'>('en')
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [expandedStep, setExpandedStep] = useState<number | null>(null)
  const [stepNotes, setStepNotes] = useState<Record<number, string>>({})
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedStep, setSelectedStep] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as 'en' | 'ar' | null
    if (savedLanguage) setLanguage(savedLanguage)

    const savedNotes = localStorage.getItem('stepNotes')
    if (savedNotes) setStepNotes(JSON.parse(savedNotes))

    const fetchProgress = async () => {
      try {
        const res = await fetch('/api/steps')
        if (!res.ok) throw new Error('Failed to fetch step progress')
        const data = await res.json()
        if (data.success && data.progress) {
          const completed = data.progress
            .filter((p: { completed: boolean }) => p.completed)
            .map((p: { stepNumber: number }) => p.stepNumber)
          setCompletedSteps(completed)
        }
      } catch (err) {
        console.error('Error fetching step progress:', err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchProgress()
  }, [])

  const t = (en: string, ar: string) => language === 'en' ? en : ar

  const toggleStep = async (stepNumber: number) => {
    const newCompleted = !completedSteps.includes(stepNumber)
    setCompletedSteps(prev =>
      newCompleted ? [...prev, stepNumber] : prev.filter(s => s !== stepNumber)
    )
    try {
      const res = await fetch('/api/steps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stepNumber, completed: newCompleted }),
      })
      if (!res.ok) throw new Error('Failed to update step')
      const data = await res.json()
      if (data.success && data.progress) {
        const completed = data.progress
          .filter((p: { completed: boolean }) => p.completed)
          .map((p: { stepNumber: number }) => p.stepNumber)
        setCompletedSteps(completed)
      }
    } catch (err) {
      console.error('Error updating step:', err)
      setCompletedSteps(prev =>
        newCompleted ? prev.filter(s => s !== stepNumber) : [...prev, stepNumber]
      )
    }
  }

  const saveNote = (stepNumber: number, note: string) => {
    const newNotes = { ...stepNotes, [stepNumber]: note }
    setStepNotes(newNotes)
    localStorage.setItem('stepNotes', JSON.stringify(newNotes))
  }

  const progress = (completedSteps.length / 12) * 100

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <BookOpen className="w-6 h-6" />
              {t('12-Step Program', 'برنامج الخطوات الـ12')}
            </h1>
            <p className="text-muted-foreground">
              {t('Work through each step at your own pace', 'اعمل على كل خطوة بالوتيرة التي تناسبك')}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}>
            {language === 'en' ? 'العربية' : 'English'}
          </Button>
        </div>

        {/* Progress Overview */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{t('Your Progress', 'تقدمك')}</CardTitle>
                <CardDescription>
                  {t('Completed steps out of 12', 'الخطوات المكتملة من 12')}
                </CardDescription>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{completedSteps.length}/12</div>
                <Badge variant="secondary">{Math.round(progress)}%</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
              </div>
            ) : (
              <Progress value={progress} className="h-3" />
            )}
            {completedSteps.length === 12 && (
              <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
                <Award className="w-8 h-8 mx-auto text-green-600 mb-2" />
                <p className="font-medium text-green-700 dark:text-green-400">
                  {t('Congratulations! You\'ve completed all 12 steps!', 'تهانينا! لقد أكملت جميع الخطوات الـ12!')}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Steps List */}
        <div className="space-y-3">
          {TWELVE_STEPS.map((step) => {
            const isCompleted = completedSteps.includes(step.number)
            const isExpanded = expandedStep === step.number
            const isLocked = step.number > 1 && !completedSteps.includes(step.number - 1)

            return (
              <Card key={step.number} className={isLocked ? 'opacity-60' : ''}>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => !isLocked && toggleStep(step.number)}
                      disabled={isLocked}
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${
                        isCompleted
                          ? 'bg-green-500 text-white'
                          : isLocked
                          ? 'bg-muted text-muted-foreground cursor-not-allowed'
                          : 'bg-primary/10 text-primary hover:bg-primary/20'
                      }`}
                    >
                      {isCompleted ? <Check className="w-5 h-5" /> : isLocked ? <Lock className="w-4 h-4" /> : step.number}
                    </button>
                    <div className="flex-1">
                      <CardTitle className="text-base">
                        {t(`Step ${step.number}: ${step.shortTitle}`, `الخطوة ${step.number}: ${step.shortTitle}`)}
                      </CardTitle>
                      <CardDescription className="line-clamp-2">
                        {t(step.title, step.title)}
                      </CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setExpandedStep(isExpanded ? null : step.number)}
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </Button>
                  </div>
                </CardHeader>
                {isExpanded && (
                  <CardContent className="pt-0 space-y-4">
                    <p className="text-sm text-muted-foreground">
                      {t(step.description, step.description)}
                    </p>
                    <div className="space-y-2">
                      <Label>{t('Your Reflections', 'تأملاتك')}</Label>
                      <Textarea
                        placeholder={t('Write your thoughts about this step...', 'اكتب أفكارك حول هذه الخطوة...')}
                        value={stepNotes[step.number] || ''}
                        onChange={(e) => saveNote(step.number, e.target.value)}
                        rows={3}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant={isCompleted ? 'outline' : 'default'}
                        onClick={() => toggleStep(step.number)}
                        className="flex-1"
                      >
                        {isCompleted ? t('Mark Incomplete', 'إلغاء الإكمال') : t('Mark Complete', 'إكمال الخطوة')}
                      </Button>
                    </div>
                  </CardContent>
                )}
              </Card>
            )
          })}
        </div>
      </div>

      <BottomNav />
      <CrisisButton />
    </div>
  )
}
