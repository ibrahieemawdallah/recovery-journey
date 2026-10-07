'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  BookOpen, Check, ChevronDown, ChevronUp, Award, Lock,
  Lightbulb, ListChecks, Quote, Flag, Clock, Target, Loader2, Play, Circle,
  Phone, FileText,
} from 'lucide-react'
import { BottomNav } from '@/components/layout/BottomNav'
import { CrisisButton } from '@/components/layout/CrisisButton'
import { TWELVE_STEPS_CONTENT } from '@/lib/steps-content'
import { worksheetsForStep } from '@/lib/step-worksheets'
import { StepWorksheet } from '@/components/steps/StepWorksheet'
import { StepTasks, StepReflections, type StepTask, type StepReflection } from '@/components/steps/StepTasks'

type Lang = 'en' | 'ar'

type StepRow = {
  stepNumber: number
  status: string
  completed: boolean
  completedAt: string | null
  startedAt: string | null
  lastWorkedAt: string | null
  tasksDone: number
  tasksTotal: number
}

type StepDetail = {
  status: string
  completed: boolean
  startedAt: string | null
  completedAt: string | null
  doneDefinition: string | null
  tasks: StepTask[]
  reflections: StepReflection[]
  worksheets: { kind: string; rows: string }[]
}

const STATUS_META: Record<string, { en: string; ar: string; cls: string }> = {
  not_started: { en: 'Not started', ar: 'لم تبدأ', cls: 'bg-muted text-muted-foreground' },
  in_progress: { en: 'In progress', ar: 'قيد العمل', cls: 'bg-warning-muted text-warning' },
  completed: { en: 'Completed', ar: 'مكتملة', cls: 'bg-success-muted text-success' },
}

export default function StepsPage() {
  const router = useRouter()
  const [language, setLanguage] = useState<Lang>('en')
  const [steps, setSteps] = useState<StepRow[]>([])
  const [summary, setSummary] = useState<{ completed: number; inProgress: number; nextStep: number | null; percent: number } | null>(null)
  const [expanded, setExpanded] = useState<number | null>(null)
  const [detail, setDetail] = useState<Record<number, StepDetail>>({})
  const [loadingDetail, setLoadingDetail] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const t = (en: string, ar: string) => (language === 'en' ? en : ar)

  const loadProgramme = useCallback(async () => {
    try {
      const res = await fetch('/api/steps')
      if (!res.ok) throw new Error('failed')
      const data = await res.json()
      if (data.success) {
        setSteps(data.steps)
        setSummary(data.summary)
      }
    } catch (err) {
      console.error('Error loading steps:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    const saved = localStorage.getItem('language') as Lang | null
    if (saved) setLanguage(saved)
    void loadProgramme()
  }, [loadProgramme])

  const loadDetail = useCallback(async (n: number) => {
    setLoadingDetail(n)
    try {
      const res = await fetch(`/api/steps?step=${n}`)
      const data = await res.json()
      if (data.success && data.progress) {
        setDetail((d) => ({ ...d, [n]: data.progress }))
      }
    } catch (err) {
      console.error('Error loading step detail:', err)
    } finally {
      setLoadingDetail(null)
    }
  }, [])

  // Deep link: /steps?step=N opens that step expanded.
  useEffect(() => {
    const stepParam = new URLSearchParams(window.location.search).get('step')
    if (stepParam) {
      const n = Number(stepParam)
      if (Number.isInteger(n) && n >= 1 && n <= 12) {
        setExpanded(n)
        void loadDetail(n)
      }
    }
  }, [loadDetail])

  const toggleExpand = (n: number) => {
    if (expanded === n) {
      setExpanded(null)
      return
    }
    setExpanded(n)
    if (!detail[n]) void loadDetail(n)
  }

  /** Any mutation returns the fresh step; fold it into local state. */
  const applyProgress = (n: number, progress: StepDetail) => {
    setDetail((d) => ({ ...d, [n]: progress }))
    void loadProgramme()
  }

  const post = async (n: number, payload: Record<string, unknown>) => {
    const res = await fetch('/api/steps', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stepNumber: n, ...payload }),
    })
    if (!res.ok) return null
    const data = await res.json()
    if (data?.progress) applyProgress(n, data.progress)
    return data
  }

  const setComplete = async (n: number, completed: boolean) => {
    await post(n, { action: 'setComplete', completed })
  }

  const saveDoneDefinition = async (n: number, value: string) => {
    const current = detail[n]?.doneDefinition ?? ''
    if (current === value) return
    await post(n, { action: 'setDoneDefinition', doneDefinition: value })
  }

  const isLocked = (n: number) => n > 1 && !(steps.find((s) => s.stepNumber === n - 1)?.completed ?? false)

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <div className="container mx-auto px-4 py-6 space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <BookOpen className="w-6 h-6" />
              {t('12-Step Program', 'برنامج الخطوات الـ12')}
            </h1>
            <p className="text-muted-foreground">
              {t('Understand each step, work it, record what you found', 'افهم كل خطوة، اعمل عليها، وسجّل ما وجدته')}
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

        {/* Progress overview */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{t('Your programme', 'برنامجك')}</CardTitle>
                <CardDescription>
                  {t('Steps completed', 'الخطوات المكتملة')}
                </CardDescription>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{summary?.completed ?? 0}/12</div>
                <Badge variant="secondary">{summary?.percent ?? 0}%</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {isLoading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <>
                <Progress value={summary?.percent ?? 0} className="h-3" />
                <div className="flex flex-wrap gap-4 text-sm">
                  <span className="text-muted-foreground">
                    {t('In progress:', 'قيد العمل:')}{' '}
                    <strong className="text-foreground">{summary?.inProgress ?? 0}</strong>
                  </span>
                  {summary?.nextStep && summary.completed < 12 && (
                    <span className="text-muted-foreground">
                      {t('Next:', 'التالي:')}{' '}
                      <strong className="text-foreground">
                        {t('Step', 'الخطوة')} {summary.nextStep}
                      </strong>
                    </span>
                  )}
                </div>
              </>
            )}
            {summary?.completed === 12 && (
              <div className="p-4 bg-success-muted rounded-lg text-center">
                <Award className="w-8 h-8 mx-auto text-success mb-2" />
                <p className="font-medium text-success">
                  {t(
                    'All 12 worked. Steps 10, 11 and 12 are daily practice — keep going.',
                    'أتممت الاثنتي عشرة. الخطوات 10 و11 و12 ممارسة يومية — استمر.'
                  )}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Steps list */}
        <div className="space-y-3">
          {TWELVE_STEPS_CONTENT.map((step) => {
            const row = steps.find((s) => s.stepNumber === step.number)
            const status = row?.status ?? 'not_started'
            const completed = row?.completed ?? false
            const locked = isLocked(step.number)
            const isOpen = expanded === step.number
            const d = detail[step.number]
            const meta = STATUS_META[status] ?? STATUS_META.not_started
            const pct = row && row.tasksTotal > 0 ? Math.round((row.tasksDone / row.tasksTotal) * 100) : 0

            return (
              <Card key={step.number} className={locked ? 'opacity-60' : ''}>
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-4">
                    {/* status dot */}
                    <div
                      className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center font-bold ${
                        completed
                          ? 'bg-success text-white'
                          : locked
                          ? 'bg-muted text-muted-foreground'
                          : status === 'in_progress'
                          ? 'bg-warning-muted text-white'
                          : 'bg-primary/10 text-primary'
                      }`}
                    >
                      {completed ? (
                        <Check className="w-5 h-5" />
                      ) : locked ? (
                        <Lock className="w-4 h-4" />
                      ) : status === 'in_progress' ? (
                        <Play className="w-4 h-4" />
                      ) : (
                        <Circle className="w-4 h-4" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <CardTitle className="text-base">
                          {t(
                            `Step ${step.number}: ${step.shortTitle.en}`,
                            `الخطوة ${step.number}: ${step.shortTitle.ar}`
                          )}
                        </CardTitle>
                        {!locked && (
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${meta.cls}`}>
                            {meta[language]}
                          </span>
                        )}
                      </div>
                      <CardDescription className="line-clamp-2 mt-1">
                        {step.title[language]}
                      </CardDescription>

                      {/* per-step task progress bar */}
                      {row && row.tasksTotal > 0 && (
                        <div className="flex items-center gap-2 mt-2">
                          <Progress value={pct} className="h-1.5 flex-1 max-w-[180px]" />
                          <span className="text-xs text-muted-foreground">
                            {row.tasksDone}/{row.tasksTotal}
                          </span>
                        </div>
                      )}
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={locked}
                      aria-label={isOpen ? t('Collapse', 'طي') : t('Expand', 'توسيع')}
                      onClick={() => toggleExpand(step.number)}
                    >
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </Button>
                  </div>
                </CardHeader>

                {isOpen && (
                  <CardContent className="pt-0 space-y-6">
                    {loadingDetail === step.number && !d ? (
                      <div className="flex items-center justify-center py-6">
                        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                      </div>
                    ) : (
                      <>
                        {/* ---- teaching content ---- */}
                        <section className="space-y-2">
                          <h4 className="flex items-center gap-2 font-semibold text-sm">
                            <Lightbulb className="w-4 h-4 text-warning" />
                            {t('What this step means', 'ماذا تعني هذه الخطوة')}
                          </h4>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {step.whatItMeans[language]}
                          </p>
                        </section>

                        {/* ---- Big Book quote ---- */}
                        <section className="space-y-2">
                          <h4 className="flex items-center gap-2 font-semibold text-sm">
                            <Quote className="w-4 h-4 text-accent-foreground" />
                            {t('From the Big Book', 'من الكتاب الأزرق')}
                          </h4>
                          <blockquote className="border-s-2 border-accent-foreground/40 ps-3 text-sm text-muted-foreground italic leading-relaxed">
                            {step.bigBookQuote[language]}
                          </blockquote>
                        </section>

                        {/* ---- crisis banner for the hardest steps ---- */}
                        {(step.number === 8 || step.number === 9) && (
                          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
                            <div className="flex items-start gap-3">
                              <Phone className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                              <div className="flex-1">
                                <p className="text-sm font-semibold text-destructive">
                                  {t(
                                    'This step can be emotionally difficult',
                                    'هذه الخطوة قد تكون صعبة عاطفياً'
                                  )}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                                  {t(
                                    'Making amends can bring up intense feelings. If you feel overwhelmed, use the crisis button below or reach out to your sponsor before continuing.',
                                    'تقديم التعويضات قد يثير مشاعر قوية. إذا شعرت بالإرهاق، استخدم زر الأزمة بالأسفل أو تواصل مع راعيك قبل المتابعة.'
                                  )}
                                </p>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  className="mt-3"
                                  onClick={() => {
                                    const btn = document.querySelector('[data-crisis-button]') as HTMLButtonElement
                                    btn?.click()
                                  }}
                                >
                                  <Phone className="w-3.5 h-3.5 mr-1.5" />
                                  {t('Get Crisis Support', 'احصل على دعم الأزمة')}
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* ---- tasks (replaces the old static howToWork list) ---- */}
                        {d && (
                          <StepTasks
                            stepNumber={step.number}
                            language={language}
                            tasks={d.tasks}
                            onChange={(tasks) =>
                              setDetail((prev) => ({
                                ...prev,
                                [step.number]: { ...prev[step.number], tasks },
                              }))
                            }
                          />
                        )}

                        <section className="space-y-2">
                          <h4 className="flex items-center gap-2 font-semibold text-sm">
                            <ListChecks className="w-4 h-4 text-primary" />
                            {t('How to work this step', 'كيف تعمل هذه الخطوة')}
                          </h4>
                          <ul className="space-y-1.5">
                            {step.howToWork[language].map((item, i) => (
                              <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                                <span className="w-5 shrink-0 flex items-center justify-center rounded-full bg-primary/10 text-primary font-medium text-xs">
                                  {i + 1}
                                </span>
                                <span className="leading-relaxed">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </section>

                        <section className="space-y-2">
                          <h4 className="flex items-center gap-2 font-semibold text-sm">
                            <Quote className="w-4 h-4 text-accent-foreground" />
                            {t('Example', 'مثال')}
                          </h4>
                          <blockquote className="border-s-2 border-accent-foreground/40 ps-3 text-sm text-muted-foreground italic leading-relaxed">
                            {step.example[language]}
                          </blockquote>
                        </section>

                        <section className="space-y-2">
                          <h4 className="flex items-center gap-2 font-semibold text-sm">
                            <Flag className="w-4 h-4 text-success" />
                            {t('How you know you are done', 'كيف تعرف أنك خلصتها')}
                          </h4>
                          <ul className="space-y-1.5">
                            {step.completionSigns[language].map((item, i) => (
                              <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                                <Check className="w-4 h-4 text-success shrink-0 mt-0.5" />
                                <span className="leading-relaxed">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </section>

                        {/* ---- clinical integration: thought record for step 4 ---- */}
                        {step.number === 4 && (
                          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                            <div className="flex items-start gap-3">
                              <FileText className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                              <div className="flex-1">
                                <p className="text-sm font-semibold">
                                  {t('Use a Thought Record', 'استخدم سجل أفكار')}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                                  {t(
                                    'The four-column inventory is a CBT exercise. A thought record can help you examine the evidence behind your resentments and fears.',
                                    'الجرد الرباعي تمرين CBT. سجل الأفكار ممكن يساعدك تفحص الأدلة وراء استيائك ومخاوفك.'
                                  )}
                                </p>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="mt-3"
                                  onClick={() => router.push('/clinical?tool=thought-record&step=4')}
                                >
                                  <FileText className="w-3.5 h-3.5 mr-1.5" />
                                  {t('Open Thought Record', 'افتح سجل الأفكار')}
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* ---- worksheets for this step ---- */}
                        {d &&
                          worksheetsForStep(step.number).map((def) => {
                            const saved = d.worksheets.find((w) => w.kind === def.kind)
                            let rows: Record<string, string>[] = []
                            try {
                              rows = saved ? JSON.parse(saved.rows) : []
                            } catch {
                              rows = []
                            }
                            return (
                              <StepWorksheet
                                key={def.kind}
                                def={def}
                                stepNumber={step.number}
                                language={language}
                                initialRows={rows}
                              />
                            )
                          })}

                        {/* ---- the user's own definition of done ---- */}
                        {d && (
                          <section className="space-y-2">
                            <Label className="flex items-center gap-2">
                              <Target className="w-4 h-4" />
                              {t('What "done" means for you on this step', 'ماذا تعني "الإتمام" لك في هذه الخطوة')}
                            </Label>
                            <Textarea
                              defaultValue={d.doneDefinition ?? ''}
                              onBlur={(e) => void saveDoneDefinition(step.number, e.target.value)}
                              placeholder={t(
                                'In your own words — so you can tell when you have actually finished…',
                                'بكلماتك أنت — حتى تعرف متى انتهيت فعلاً…'
                              )}
                              rows={2}
                              className="text-sm"
                            />
                          </section>
                        )}

                        {/* ---- reflections ---- */}
                        {d && (
                          <StepReflections
                            stepNumber={step.number}
                            language={language}
                            reflections={d.reflections}
                            onChange={(reflections) =>
                              setDetail((prev) => ({
                                ...prev,
                                [step.number]: { ...prev[step.number], reflections },
                              }))
                            }
                          />
                        )}

                        {/* ---- duration + dates ---- */}
                        <section className="flex items-start gap-2 rounded-lg bg-muted/50 p-3">
                          <Clock className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                          <div className="text-sm space-y-1">
                            <div>
                              <span className="font-medium">{t('Typical duration: ', 'المدة المعتادة: ')}</span>
                              <span className="text-muted-foreground">{step.typicalDuration[language]}</span>
                            </div>
                            {d?.startedAt && (
                              <div className="text-xs text-muted-foreground">
                                {t('Started ', 'بدأت ')}
                                {new Date(d.startedAt).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-GB')}
                                {d.completedAt && (
                                  <>
                                    {' · '}
                                    {t('completed ', 'أُكملت ')}
                                    {new Date(d.completedAt).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-GB')}
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        </section>

                        {/* ---- complete toggle ---- */}
                        <Button
                          variant={completed ? 'outline' : 'default'}
                          onClick={() => void setComplete(step.number, !completed)}
                          className="w-full"
                        >
                          {completed
                            ? t('Mark as not complete', 'إلغاء الإكمال')
                            : t('I have worked this step', 'أنجزت هذه الخطوة')}
                        </Button>
                      </>
                    )}
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
