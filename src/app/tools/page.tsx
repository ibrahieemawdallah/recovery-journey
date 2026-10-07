'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { BottomNav } from '@/components/layout/BottomNav'
import { CrisisButton } from '@/components/layout/CrisisButton'
import { Wind, Brain, Heart, Shield, Play, Pause, RotateCcw, Timer, Volume2, Eye, Hand, Footprints, Music, Sun, Moon, Droplets, Zap, Leaf, Anchor, Loader2, Plus, Activity, Users, FileText } from 'lucide-react'

const BREATHING_EXERCISES = [
  { id: 'box-breathing', name: 'Box Breathing', nameAr: 'تنفس الصندوق', duration: '4 min', description: 'Inhale 4s, Hold 4s, Exhale 4s, Hold 4s', pattern: [4, 4, 4, 4], icon: Wind },
  { id: '4-7-8', name: '4-7-8 Breathing', nameAr: 'تنفس 4-7-8', duration: '5 min', description: 'Inhale 4s, Hold 7s, Exhale 8s', pattern: [4, 7, 8], icon: Wind },
  { id: 'deep-calm', name: 'Deep Calm', nameAr: 'هدوء عميق', duration: '3 min', description: 'Slow, deep breaths for relaxation', pattern: [4, 2, 6], icon: Wind },
  { id: 'energizing', name: 'Energizing Breath', nameAr: 'تنفس منشط', duration: '2 min', description: 'Quick, rhythmic breaths for energy', pattern: [2, 0, 2], icon: Zap },
]

const GROUNDING_TECHNIQUES = [
  { id: '5-4-3-2-1', name: '5-4-3-2-1 Senses', nameAr: '5-4-3-2-1 الحواس', description: '5 things you see, 4 you touch, 3 you hear, 2 you smell, 1 you taste', icon: Eye },
  { id: 'body-scan', name: 'Body Scan', nameAr: 'مسح الجسم', description: 'Focus attention on each part of your body', icon: Hand },
  { id: 'feet-ground', name: 'Feet on Ground', nameAr: 'القدمان على الأرض', description: 'Feel your feet firmly on the ground', icon: Footprints },
  { id: 'object-focus', name: 'Object Focus', nameAr: 'التركيز على شيء', description: 'Focus on an object in detail', icon: Eye },
]

interface CopingSkill {
  id: string
  userId: string
  name: string
  description: string | null
  category: string
  effectiveness: number
  timesUsed: number
  createdAt: string
}

export default function ToolsPage() {
  const [language, setLanguage] = useState<'en' | 'ar'>('en')
  const [activeTab, setActiveTab] = useState('breathing')
  const [isBreathing, setIsBreathing] = useState(false)
  const [breathPhase, setBreathPhase] = useState(0)
  const [breathTimer, setBreathTimer] = useState(0)
  const [selectedExercise, setSelectedExercise] = useState(BREATHING_EXERCISES[0])
  const [breathCount, setBreathCount] = useState(0)
  const [copingSkills, setCopingSkills] = useState<CopingSkill[]>([])
  const [isLoadingSkills, setIsLoadingSkills] = useState(true)
  const [isAddingSkill, setIsAddingSkill] = useState(false)
  const [newSkill, setNewSkill] = useState({ name: '', description: '', category: 'cognitive' })

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as 'en' | 'ar' | null
    if (savedLanguage) setLanguage(savedLanguage)
  }, [])

  useEffect(() => {
    const fetchCopingSkills = async () => {
      setIsLoadingSkills(true)
      try {
        const res = await fetch('/api/coping-skills')
        const data = await res.json()
        if (data.success) {
          setCopingSkills(data.data)
        } else {
          console.error('Failed to fetch coping skills:', data.error)
        }
      } catch (err) {
        console.error('Error fetching coping skills:', err)
      } finally {
        setIsLoadingSkills(false)
      }
    }

    fetchCopingSkills()
  }, [])

  const addSkill = async () => {
    if (!newSkill.name) return

    try {
      const res = await fetch('/api/coping-skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newSkill.name,
          description: newSkill.description,
          category: newSkill.category,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setCopingSkills(prev => [data.data, ...prev])
        setNewSkill({ name: '', description: '', category: 'cognitive' })
        setIsAddingSkill(false)
      } else {
        console.error('Failed to add coping skill:', data.error)
      }
    } catch (err) {
      console.error('Error adding coping skill:', err)
    }
  }

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isBreathing) {
      interval = setInterval(() => {
        setBreathTimer(prev => {
          const newTimer = prev + 1
          const pattern = selectedExercise.pattern
          const totalCycle = pattern.reduce((a, b) => a + b, 0)
          const cyclePosition = newTimer % totalCycle
          
          let phase = 0
          let accumulated = 0
          for (let i = 0; i < pattern.length; i++) {
            accumulated += pattern[i]
            if (cyclePosition < accumulated) {
              phase = i
              break
            }
          }
          setBreathPhase(phase)
          
          if (cyclePosition === 0) {
            setBreathCount(c => c + 1)
          }
          
          return newTimer
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isBreathing, selectedExercise])

  const t = (en: string, ar: string) => language === 'en' ? en : ar

  const startBreathing = () => {
    setIsBreathing(true)
    setBreathTimer(0)
    setBreathCount(0)
  }

  const stopBreathing = () => {
    setIsBreathing(false)
    setBreathTimer(0)
    setBreathPhase(0)
  }

  const resetBreathing = () => {
    setBreathTimer(0)
    setBreathCount(0)
    setBreathPhase(0)
  }

  const phaseNames = [t('Inhale', 'شهيق'), t('Hold', 'حبس'), t('Exhale', 'زفير')]
  const currentPhase = phaseNames[breathPhase] || phaseNames[0]

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'cognitive': return Brain
      case 'behavioral': return Activity
      case 'physical': return Footprints
      case 'social': return Users
      default: return Brain
    }
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Wind className="w-6 h-6" />
              {t('Recovery Tools', 'أدوات التعافي')}
            </h1>
            <p className="text-muted-foreground">
              {t('Exercises and techniques for difficult moments', 'تمارين وتقنيات للحظات الصعبة')}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}>
            {language === 'en' ? 'العربية' : 'English'}
          </Button>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="breathing">{t('Breathing', 'التنفس')}</TabsTrigger>
            <TabsTrigger value="grounding">{t('Grounding', 'التأريض')}</TabsTrigger>
            <TabsTrigger value="coping">{t('Coping', 'التأقلم')}</TabsTrigger>
          </TabsList>

          <TabsContent value="breathing" className="space-y-4">
            {/* Breathing Exercise Selector */}
            <div className="grid gap-3 md:grid-cols-2">
              {BREATHING_EXERCISES.map((exercise) => (
                <Card
                  key={exercise.id}
                  className={`cursor-pointer transition-colors ${
                    selectedExercise.id === exercise.id ? 'border-primary' : ''
                  }`}
                  onClick={() => setSelectedExercise(exercise)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base flex items-center gap-2">
                        <exercise.icon className="w-5 h-5" />
                        {t(exercise.name, exercise.nameAr)}
                      </CardTitle>
                      <Badge variant="secondary">{exercise.duration}</Badge>
                    </div>
                    <CardDescription>{t(exercise.description, exercise.description)}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>

            {/* Breathing Exercise Player */}
            <Card>
              <CardHeader>
                <CardTitle className="text-center">{t(selectedExercise.name, selectedExercise.nameAr)}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col items-center space-y-4">
                  <div className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-1000 ${
                    isBreathing ? 'bg-primary/20 scale-110' : 'bg-muted'
                  }`}>
                    <div className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-1000 ${
                      isBreathing ? 'bg-primary/30 scale-100' : 'bg-muted-foreground/20'
                    }`}>
                      <span className="text-2xl font-bold">{isBreathing ? currentPhase : t('Ready?', 'مستعد؟')}</span>
                    </div>
                  </div>
                  
                  <div className="text-center space-y-1">
                    <p className="text-3xl font-mono font-bold">{breathTimer}s</p>
                    <p className="text-sm text-muted-foreground">
                      {t('Cycles:', 'الدورات:')} {breathCount}
                    </p>
                  </div>

                  <div className="flex gap-3">
                    {!isBreathing ? (
                      <Button onClick={startBreathing} size="lg">
                        <Play className="w-5 h-5 mr-2" />
                        {t('Start', 'ابدأ')}
                      </Button>
                    ) : (
                      <Button onClick={stopBreathing} variant="outline" size="lg">
                        <Pause className="w-5 h-5 mr-2" />
                        {t('Pause', 'إيقاف مؤقت')}
                      </Button>
                    )}
                    <Button onClick={resetBreathing} variant="outline" size="lg">
                      <RotateCcw className="w-5 h-5" />
                    </Button>
                  </div>
                </div>

                {/* Pattern Display */}
                <div className="flex justify-center gap-4">
                  {selectedExercise.pattern.map((duration, i) => (
                    <div key={i} className="text-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-1 ${
                        isBreathing && breathPhase === i ? 'bg-primary text-primary-foreground' : 'bg-muted'
                      }`}>
                        <span className="text-sm font-bold">{duration}s</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{phaseNames[i]}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="grounding" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {GROUNDING_TECHNIQUES.map((technique) => (
                <Card key={technique.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <technique.icon className="w-5 h-5" />
                      {t(technique.name, technique.nameAr)}
                    </CardTitle>
                    <CardDescription>{t(technique.description, technique.description)}</CardDescription>
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

          <TabsContent value="coping" className="space-y-4">
            {/* Add Skill Button */}
            <div className="flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAddingSkill(!isAddingSkill)}
              >
                <Plus className="w-4 h-4 mr-2" />
                {t('Add Skill', 'إضافة مهارة')}
              </Button>
            </div>

            {/* Add Skill Form */}
            {isAddingSkill && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    {t('Add Coping Skill', 'إضافة مهارة تأقلم')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>{t('Name', 'الاسم')}</Label>
                    <Input
                      placeholder={t('Skill name', 'اسم المهارة')}
                      value={newSkill.name}
                      onChange={(e) => setNewSkill(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('Description', 'الوصف')}</Label>
                    <Textarea
                      placeholder={t('Describe this skill', 'صف هذه المهارة')}
                      value={newSkill.description}
                      onChange={(e) => setNewSkill(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('Category', 'الفئة')}</Label>
                    <Select value={newSkill.category} onValueChange={(value) => setNewSkill(prev => ({ ...prev, category: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cognitive">{t('Cognitive', 'معرفي')}</SelectItem>
                        <SelectItem value="behavioral">{t('Behavioral', 'سلوكي')}</SelectItem>
                        <SelectItem value="physical">{t('Physical', 'جسدي')}</SelectItem>
                        <SelectItem value="social">{t('Social', 'اجتماعي')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setIsAddingSkill(false)}>
                      {t('Cancel', 'إلغاء')}
                    </Button>
                    <Button onClick={addSkill}>
                      <Plus className="w-4 h-4 mr-2" />
                      {t('Add Skill', 'إضافة مهارة')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Coping Skills List */}
            {isLoadingSkills ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            ) : copingSkills.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">{t('No coping skills yet. Add your first one!', 'لا توجد مهارات تأقلم بعد. أضف أول مهارة!')}</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {copingSkills.map((skill) => {
                  const Icon = getCategoryIcon(skill.category)
                  return (
                    <Card key={skill.id}>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                          <Icon className="w-5 h-5" />
                          {skill.name}
                        </CardTitle>
                        <CardDescription>{skill.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <Badge variant="secondary">{t(skill.category, skill.category)}</Badge>
                        <Button variant="outline" size="sm" className="w-full">
                          {t('Try Now', 'جرب الآن')}
                        </Button>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <BottomNav />
      <CrisisButton />
    </div>
  )
}
