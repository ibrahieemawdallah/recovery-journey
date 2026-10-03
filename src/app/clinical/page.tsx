'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { BottomNav } from '@/components/layout/BottomNav'
import { CrisisButton } from '@/components/layout/CrisisButton'
import { Brain, Wind, Shield, FileText, AlertTriangle, CheckCircle2, Plus, Trash2, Save, Activity, Heart, Zap, Eye } from 'lucide-react'

const CBT_EXERCISES = [
  { id: 'thought-record', title: 'Thought Record', description: 'Identify and challenge negative thought patterns', icon: FileText },
  { id: 'cognitive-restructuring', title: 'Cognitive Restructuring', description: 'Reframe distorted thinking', icon: Brain },
  { id: 'behavioral-activation', title: 'Behavioral Activation', description: 'Schedule positive activities', icon: Activity },
  { id: 'exposure-hierarchy', title: 'Exposure Hierarchy', description: 'Gradual exposure to triggers', icon: Eye },
]

const DBT_EXERCISES = [
  { id: 'distress-tolerance', title: 'Distress Tolerance', description: 'Crisis survival skills', icon: Shield },
  { id: 'emotion-regulation', title: 'Emotion Regulation', description: 'Manage intense emotions', icon: Heart },
  { id: 'interpersonal-effectiveness', title: 'Interpersonal Effectiveness', description: 'Communication skills', icon: Zap },
  { id: 'mindfulness', title: 'Mindfulness', description: 'Present moment awareness', icon: Wind },
]

export default function ClinicalPage() {
  const [language, setLanguage] = useState<'en' | 'ar'>('en')
  const [activeTab, setActiveTab] = useState('cbt')
  const [thoughtRecords, setThoughtRecords] = useState<any[]>([])
  const [loadingRecords, setLoadingRecords] = useState(true)
  const [savingRecord, setSavingRecord] = useState(false)
  const [newRecord, setNewRecord] = useState({
    situation: '',
    automaticThought: '',
    emotion: '',
    intensity: 5,
    evidence: '',
    alternative: '',
  })
  const [copingSkills, setCopingSkills] = useState<any[]>([])
  const [relapsePlan, setRelapsePlan] = useState({
    triggers: '',
    warningSigns: '',
    copingStrategies: '',
    supportContacts: '',
    reasons: '',
  })
  const [loadingPlan, setLoadingPlan] = useState(true)
  const [savingPlan, setSavingPlan] = useState(false)
  const [riskAssessment, setRiskAssessment] = useState({
    mood: 5,
    sleep: 5,
    social: 5,
    stress: 5,
    cravings: 5,
  })
  const [savingRisk, setSavingRisk] = useState(false)

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as 'en' | 'ar' | null
    if (savedLanguage) setLanguage(savedLanguage)

    const loadData = async () => {
      try {
        // Load thought records
        const recordsRes = await fetch('/api/thought-records')
        const recordsData = await recordsRes.json()
        if (recordsData.success) setThoughtRecords(recordsData.data || [])
      } catch (err) {
        console.error('Failed to load thought records:', err)
      } finally {
        setLoadingRecords(false)
      }

      try {
        // Load relapse plan (404 = no plan yet, not an error)
        const planRes = await fetch('/api/relapse-plan')
        if (planRes.status !== 404) {
          const planData = await planRes.json()
          if (planData?.success && planData.data) {
            const plan = planData.data
            setRelapsePlan({
              triggers: plan.triggers ? (typeof plan.triggers === 'string' ? plan.triggers : JSON.stringify(plan.triggers)) : '',
              warningSigns: plan.warningSigns ? (typeof plan.warningSigns === 'string' ? plan.warningSigns : JSON.stringify(plan.warningSigns)) : '',
              copingStrategies: plan.copingStrategies ? (typeof plan.copingStrategies === 'string' ? plan.copingStrategies : JSON.stringify(plan.copingStrategies)) : '',
              supportContacts: plan.supportContacts ? (typeof plan.supportContacts === 'string' ? plan.supportContacts : JSON.stringify(plan.supportContacts)) : '',
              reasons: plan.reasons || '',
            })
          }
        }
      } catch (err) {
        console.error('Failed to load relapse plan:', err)
      } finally {
        setLoadingPlan(false)
      }
    }
    loadData()
  }, [])

  const t = (en: string, ar: string) => language === 'en' ? en : ar

  const saveThoughtRecord = async () => {
    if (!newRecord.situation || !newRecord.automaticThought) return

    setSavingRecord(true)
    try {
      const res = await fetch('/api/thought-records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          situation: newRecord.situation,
          automaticThought: newRecord.automaticThought,
          emotion: newRecord.emotion,
          emotionIntensity: newRecord.intensity,
          evidence: newRecord.evidence || null,
          alternative: newRecord.alternative || null,
          outcome: null,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setThoughtRecords(prev => [data.data, ...prev])
        setNewRecord({ situation: '', automaticThought: '', emotion: '', intensity: 5, evidence: '', alternative: '' })
      }
    } catch (err) {
      console.error('Failed to save thought record:', err)
    } finally {
      setSavingRecord(false)
    }
  }

  const deleteRecord = async (id: string) => {
    try {
      const res = await fetch(`/api/thought-records?id=${encodeURIComponent(id)}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        setThoughtRecords(prev => prev.filter(r => r.id !== id))
      }
    } catch (err) {
      console.error('Failed to delete thought record:', err)
    }
  }

  const saveRelapsePlan = async () => {
    setSavingPlan(true)
    try {
      const res = await fetch('/api/relapse-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          triggers: relapsePlan.triggers,
          warningSigns: relapsePlan.warningSigns,
          copingStrategies: relapsePlan.copingStrategies,
          supportContacts: relapsePlan.supportContacts,
          reasons: relapsePlan.reasons,
        }),
      })
      const data = await res.json()
      if (!data.success) console.error('Failed to save relapse plan:', data.error)
    } catch (err) {
      console.error('Failed to save relapse plan:', err)
    } finally {
      setSavingPlan(false)
    }
  }

  const saveRiskAssessment = async () => {
    setSavingRisk(true)
    try {
      const res = await fetch('/api/risk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          riskType: 'relapse',
          severity: riskLevel,
          score: Math.round(riskScore * 10),
          factors: JSON.stringify(riskAssessment),
          notes: null,
        }),
      })
      const data = await res.json()
      if (!data.success) console.error('Failed to save risk assessment:', data.error)
    } catch (err) {
      console.error('Failed to save risk assessment:', err)
    } finally {
      setSavingRisk(false)
    }
  }

  const riskScore = Object.values(riskAssessment).reduce((a, b) => a + b, 0) / 5
  const riskLevel = riskScore < 3 ? 'low' : riskScore < 4 ? 'moderate' : 'high'

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Brain className="w-6 h-6" />
              {t('Clinical Tools', 'الأدوات السريرية')}
            </h1>
            <p className="text-muted-foreground">
              {t('Evidence-based therapeutic exercises', 'تمارين علاجية قائمة على الأدلة')}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}>
            {language === 'en' ? 'العربية' : 'English'}
          </Button>
        </div>

        {/* Risk Assessment */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              {t('Risk Assessment', 'تقييم المخاطر')}
            </CardTitle>
            <CardDescription>
              {t('Rate your current state (1-10)', 'قيم حالتك الحالية (1-10)')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { key: 'mood', label: t('Mood Stability', 'استقرار المزاج') },
                { key: 'sleep', label: t('Sleep Quality', 'جودة النوم') },
                { key: 'social', label: t('Social Support', 'الدعم الاجتماعي') },
                { key: 'stress', label: t('Stress Level', 'مستوى التوتر') },
                { key: 'cravings', label: t('Craving Intensity', 'شدة الرغبة') },
              ].map((item) => (
                <div key={item.key} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">{item.label}</Label>
                    <span className="text-sm font-medium">{riskAssessment[item.key as keyof typeof riskAssessment]}/10</span>
                  </div>
                  <Slider
                    value={[riskAssessment[item.key as keyof typeof riskAssessment]]}
                    onValueChange={([v]) => setRiskAssessment(prev => ({ ...prev, [item.key]: v }))}
                    max={10}
                    step={1}
                  />
                </div>
              ))}
              <div className={`p-4 rounded-lg ${
                riskLevel === 'low' ? 'bg-green-50 dark:bg-green-900/20' :
                riskLevel === 'moderate' ? 'bg-yellow-50 dark:bg-yellow-900/20' :
                'bg-red-50 dark:bg-red-900/20'
              }`}>
                <div className="flex items-center gap-2">
                  {riskLevel === 'low' && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                  {riskLevel === 'moderate' && <AlertTriangle className="w-5 h-5 text-yellow-600" />}
                  {riskLevel === 'high' && <AlertTriangle className="w-5 h-5 text-red-600" />}
                  <span className="font-medium">
                    {riskLevel === 'low' ? t('Low Risk - You\'re doing well!', 'مخاطر منخفضة - أنت تبلي بلاءً حسناً!') :
                     riskLevel === 'moderate' ? t('Moderate Risk - Consider reaching out', 'مخاطر معتدلة - فكر في التواصل') :
                     t('High Risk - Please seek support', 'مخاطر عالية - يرجى طلب الدعم')}
                  </span>
                </div>
              </div>
              <Button onClick={saveRiskAssessment} disabled={savingRisk} className="w-full">
                <Save className="w-4 h-4 mr-2" />
                {savingRisk ? t('Saving...', 'جاري الحفظ...') : t('Save Assessment', 'حفظ التقييم')}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="cbt">CBT</TabsTrigger>
            <TabsTrigger value="dbt">DBT</TabsTrigger>
            <TabsTrigger value="records">{t('Records', 'السجلات')}</TabsTrigger>
            <TabsTrigger value="plan">{t('Relapse Plan', 'خطة الانتكاس')}</TabsTrigger>
          </TabsList>

          <TabsContent value="cbt" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {CBT_EXERCISES.map((exercise) => (
                <Card key={exercise.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <exercise.icon className="w-5 h-5" />
                      {t(exercise.title, exercise.title)}
                    </CardTitle>
                    <CardDescription>{t(exercise.description, exercise.description)}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" size="sm" className="w-full">
                      {t('Start Exercise', 'ابدأ التمرين')}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Thought Record Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  {t('New Thought Record', 'سجل أفكار جديد')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>{t('Situation', 'الموقف')}</Label>
                  <Textarea
                    placeholder={t('What happened?', 'ماذا حدث؟')}
                    value={newRecord.situation}
                    onChange={(e) => setNewRecord(prev => ({ ...prev, situation: e.target.value }))}
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t('Automatic Thought', 'الفكرة التلقائية')}</Label>
                  <Textarea
                    placeholder={t('What went through your mind?', 'ما الذي دار في ذهنك؟')}
                    value={newRecord.automaticThought}
                    onChange={(e) => setNewRecord(prev => ({ ...prev, automaticThought: e.target.value }))}
                    rows={2}
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>{t('Emotion', 'العاطفة')}</Label>
                    <Select value={newRecord.emotion} onValueChange={(v) => setNewRecord(prev => ({ ...prev, emotion: v }))}>
                      <SelectTrigger>
                        <SelectValue placeholder={t('Select emotion', 'اختر عاطفة')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="anxiety">{t('Anxiety', 'قلق')}</SelectItem>
                        <SelectItem value="sadness">{t('Sadness', 'حزن')}</SelectItem>
                        <SelectItem value="anger">{t('Anger', 'غضب')}</SelectItem>
                        <SelectItem value="fear">{t('Fear', 'خوف')}</SelectItem>
                        <SelectItem value="shame">{t('Shame', 'خجل')}</SelectItem>
                        <SelectItem value="guilt">{t('Guilt', 'ذنب')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>{t('Intensity (1-10)', 'الشدة (1-10)')}</Label>
                    <Slider
                      value={[newRecord.intensity]}
                      onValueChange={([v]) => setNewRecord(prev => ({ ...prev, intensity: v }))}
                      max={10}
                      step={1}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>{t('Evidence For/Against', 'الأدلة المؤيدة/المعارضة')}</Label>
                  <Textarea
                    placeholder={t('What evidence supports or contradicts this thought?', 'ما الأدلة التي تدعم أو تناقض هذه الفكرة؟')}
                    value={newRecord.evidence}
                    onChange={(e) => setNewRecord(prev => ({ ...prev, evidence: e.target.value }))}
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t('Alternative Thought', 'الفكرة البديلة')}</Label>
                  <Textarea
                    placeholder={t('What\'s a more balanced perspective?', 'ما هو المنظور الأكثر توازناً؟')}
                    value={newRecord.alternative}
                    onChange={(e) => setNewRecord(prev => ({ ...prev, alternative: e.target.value }))}
                    rows={2}
                  />
                </div>
                <Button onClick={saveThoughtRecord} disabled={savingRecord} className="w-full">
                  <Save className="w-4 h-4 mr-2" />
                  {savingRecord ? t('Saving...', 'جاري الحفظ...') : t('Save Record', 'حفظ السجل')}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dbt" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {DBT_EXERCISES.map((exercise) => (
                <Card key={exercise.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <exercise.icon className="w-5 h-5" />
                      {t(exercise.title, exercise.title)}
                    </CardTitle>
                    <CardDescription>{t(exercise.description, exercise.description)}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" size="sm" className="w-full">
                      {t('Start Exercise', 'ابدأ التمرين')}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="records" className="space-y-4">
            {loadingRecords ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">{t('Loading...', 'جاري التحميل...')}</p>
                </CardContent>
              </Card>
            ) : thoughtRecords.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">{t('No thought records yet', 'لا توجد سجلات أفكار بعد')}</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {thoughtRecords.map((record) => (
                  <Card key={record.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-base">{record.situation}</CardTitle>
                          <CardDescription>{new Date(record.createdAt).toLocaleDateString()}</CardDescription>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => deleteRecord(record.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="text-sm"><strong>{t('Thought:', 'الفكرة:')}</strong> {record.automaticThought}</p>
                      <p className="text-sm"><strong>{t('Emotion:', 'العاطفة:')}</strong> {record.emotion} ({record.emotionIntensity}/10)</p>
                      {record.evidence && <p className="text-sm"><strong>{t('Evidence:', 'الأدلة:')}</strong> {record.evidence}</p>}
                      {record.alternative && <p className="text-sm"><strong>{t('Alternative:', 'البديل:')}</strong> {record.alternative}</p>}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="plan" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  {t('Relapse Prevention Plan', 'خطة منع الانتكاس')}
                </CardTitle>
                <CardDescription>
                  {t('Create a personalized plan to maintain your recovery', 'أنشئ خطة مخصصة للحفاظ على تعافيك')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {loadingPlan ? (
                  <p className="text-muted-foreground text-center py-4">{t('Loading...', 'جاري التحميل...')}</p>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label>{t('Triggers', 'المحفزات')}</Label>
                      <Textarea
                        placeholder={t('What situations, people, or emotions trigger cravings?', 'ما المواقف أو الأشخاص أو العواطف التي تحفز الرغبات؟')}
                        value={relapsePlan.triggers}
                        onChange={(e) => setRelapsePlan(prev => ({ ...prev, triggers: e.target.value }))}
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{t('Warning Signs', 'علامات التحذير')}</Label>
                      <Textarea
                        placeholder={t('What signs indicate you might be at risk?', 'ما العلامات التي تشير إلى أنك قد تكون في خطر؟')}
                        value={relapsePlan.warningSigns}
                        onChange={(e) => setRelapsePlan(prev => ({ ...prev, warningSigns: e.target.value }))}
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{t('Coping Strategies', 'استراتيجيات التأقلم')}</Label>
                      <Textarea
                        placeholder={t('What healthy coping strategies work for you?', 'ما استراتيجيات التأقلم الصحية التي تناسبك؟')}
                        value={relapsePlan.copingStrategies}
                        onChange={(e) => setRelapsePlan(prev => ({ ...prev, copingStrategies: e.target.value }))}
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{t('Support Contacts', 'جهات الاتصال الداعمة')}</Label>
                      <Textarea
                        placeholder={t('Who can you reach out to for support?', 'من يمكنك التواصل معه للحصول على الدعم؟')}
                        value={relapsePlan.supportContacts}
                        onChange={(e) => setRelapsePlan(prev => ({ ...prev, supportContacts: e.target.value }))}
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{t('Reasons for Recovery', 'أسباب التعافي')}</Label>
                      <Textarea
                        placeholder={t('Why is recovery important to you?', 'لماذا التعافي مهم لك؟')}
                        value={relapsePlan.reasons}
                        onChange={(e) => setRelapsePlan(prev => ({ ...prev, reasons: e.target.value }))}
                        rows={3}
                      />
                    </div>
                    <Button onClick={saveRelapsePlan} disabled={savingPlan} className="w-full">
                      <Save className="w-4 h-4 mr-2" />
                      {savingPlan ? t('Saving...', 'جاري الحفظ...') : t('Save Plan', 'حفظ الخطة')}
                    </Button>
                  </>
                )}
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
