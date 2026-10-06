'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { BottomNav } from '@/components/layout/BottomNav'
import { CrisisButton } from '@/components/layout/CrisisButton'
import { TreeLogoMark } from '@/components/brand/tree-logo-mark'
import {
  Users, Star, MapPin, Award, Send, Check, Clock, Loader2,
  UserPlus, MessageCircle, Calendar, Shield,
} from 'lucide-react'

type Lang = 'en' | 'ar'

type Sponsor = {
  id: string
  name: string
  bio: string | null
  skills: string[]
  location: string | null
  averageRating: number
  totalRatings: number
  isAvailable: boolean
}

type MyRequest = {
  id: string
  title: string
  status: string
  helper: { id: string; name: string } | null
  createdAt: string
}

export default function SponsorPage() {
  const router = useRouter()
  const [language, setLanguage] = useState<Lang>('en')
  const [sponsors, setSponsors] = useState<Sponsor[]>([])
  const [myRequests, setMyRequests] = useState<MyRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [requesting, setRequesting] = useState(false)
  const [selectedSponsor, setSelectedSponsor] = useState<string | null>(null)
  const [requestMessage, setRequestMessage] = useState('')
  const [showForm, setShowForm] = useState(false)

  const t = (en: string, ar: string) => (language === 'en' ? en : ar)

  useEffect(() => {
    const saved = localStorage.getItem('language') as Lang | null
    if (saved) setLanguage(saved)
    void loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      // Load available sponsors
      const res = await fetch('/api/peer-support?action=available')
      const data = await res.json()
      if (data.success) {
        setSponsors(data.supporters || [])
      }

      // Load my help requests (sponsor requests)
      const myRes = await fetch('/api/help-requests?category=mentorship')
      const myData = await myRes.json()
      if (myData.success) {
        setMyRequests(myData.requests || [])
      }
    } catch (err) {
      console.error('Error loading sponsor data:', err)
    } finally {
      setLoading(false)
    }
  }

  const requestSponsor = async (sponsorId: string) => {
    if (!requestMessage.trim()) return
    setRequesting(true)
    try {
      const res = await fetch('/api/matching', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: t('Sponsor Request', 'طلب راعي'),
          description: requestMessage.trim(),
          category: 'mentorship',
          urgency: 'medium',
        }),
      })
      const data = await res.json()
      if (data.success) {
        setShowForm(false)
        setRequestMessage('')
        setSelectedSponsor(null)
        await loadData()
      }
    } catch (err) {
      console.error('Error requesting sponsor:', err)
    } finally {
      setRequesting(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
      case 'accepted': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
      case 'completed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
      default: return 'bg-muted text-muted-foreground'
    }
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, { en: string; ar: string }> = {
      pending: { en: 'Pending', ar: 'قيد الانتظار' },
      accepted: { en: 'Accepted', ar: 'مقبول' },
      completed: { en: 'Completed', ar: 'مكتمل' },
      cancelled: { en: 'Cancelled', ar: 'ملغي' },
    }
    return labels[status]?.[language] ?? status
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Users className="w-6 h-6" />
              {t('Find a Sponsor', 'ابحث عن راعي')}
            </h1>
            <p className="text-muted-foreground">
              {t(
                'Connect with someone experienced in recovery who can guide you through the steps',
                'تواصل مع شخص لديه خبرة في التعافي ويمكنه إرشادك خلال الخطوات'
              )}
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

        {/* My Requests */}
        {myRequests.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="w-4 h-4" />
                {t('My Sponsor Requests', 'طلباتي للراعي')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {myRequests.map((req) => (
                <div key={req.id} className="flex items-center justify-between rounded-lg border border-border/60 p-3">
                  <div>
                    <p className="font-medium text-sm">{req.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {req.helper
                        ? `${t('With', 'مع')}: ${req.helper.name}`
                        : t('Waiting for a sponsor…', 'في انتظار راعي…')}
                    </p>
                  </div>
                  <Badge className={getStatusColor(req.status)}>
                    {getStatusLabel(req.status)}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Available Sponsors */}
        <div>
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            {t('Available Sponsors', 'الرعاة المتاحون')}
            <Badge variant="secondary">{sponsors.length}</Badge>
          </h2>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : sponsors.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  {t(
                    'No sponsors available right now. Check back later or ask in the community chat.',
                    'لا يوجد رعاة متاحون حالياً. تحقق لاحقاً أو اسأل في محادثة المجتمع.'
                  )}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {sponsors.map((sponsor) => (
                <Card key={sponsor.id} className="relative">
                  {sponsor.isAvailable && (
                    <div className="absolute top-3 right-3">
                      <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                        <Check className="w-3 h-3 mr-1" />
                        {t('Available', 'متاح')}
                      </Badge>
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <TreeLogoMark className="h-8 w-8" animate={false} title={sponsor.name} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base">{sponsor.name}</CardTitle>
                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                          {sponsor.averageRating > 0 && (
                            <span className="flex items-center gap-1">
                              <Star className="w-3 h-3 fill-warning text-warning" />
                              {sponsor.averageRating.toFixed(1)}
                            </span>
                          )}
                          {sponsor.totalRatings > 0 && (
                            <span>({sponsor.totalRatings} {t('reviews', 'تقييم')})</span>
                          )}
                          {sponsor.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {sponsor.location}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {sponsor.bio && (
                      <p className="text-sm text-muted-foreground line-clamp-3">{sponsor.bio}</p>
                    )}
                    {sponsor.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {sponsor.skills.slice(0, 4).map((skill) => (
                          <Badge key={skill} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    )}
                    <Button
                      className="w-full"
                      disabled={!sponsor.isAvailable || requesting}
                      onClick={() => {
                        setSelectedSponsor(sponsor.id)
                        setShowForm(true)
                      }}
                    >
                      <Send className="w-4 h-4 mr-2" />
                      {t('Request as Sponsor', 'اطلب كراعٍ')}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Request Form Modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>{t('Request a Sponsor', 'اطلب راعياً')}</CardTitle>
                <CardDescription>
                  {t(
                    'Tell them a bit about yourself and what you are working on',
                    'أخبرهم قليلاً عن نفسك وما تعمل عليه'
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>{t('Your message', 'رسالتك')}</Label>
                  <Textarea
                    value={requestMessage}
                    onChange={(e) => setRequestMessage(e.target.value)}
                    placeholder={t(
                      'Hi, I am working on the 12 steps and would appreciate guidance…',
                      'مرحباً، أنا أعمل على الخطوات الـ12 وأقدر الإرشاد…'
                    )}
                    rows={4}
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setShowForm(false)
                      setRequestMessage('')
                      setSelectedSponsor(null)
                    }}
                  >
                    {t('Cancel', 'إلغاء')}
                  </Button>
                  <Button
                    className="flex-1"
                    disabled={!requestMessage.trim() || requesting}
                    onClick={() => selectedSponsor && void requestSponsor(selectedSponsor)}
                  >
                    {requesting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    {t('Send Request', 'إرسال الطلب')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Info Card */}
        <Card className="bg-accent/50">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <Shield className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium mb-1">{t('What is a sponsor?', 'ما هو الراعي؟')}</p>
                <p className="text-muted-foreground leading-relaxed">
                  {t(
                    'A sponsor is someone experienced in recovery who guides you through the 12 steps. They share their experience, strength, and hope — but they do not tell you what to do. A sponsor is a mentor, not a therapist or a parent.',
                    'الراعي هو شخص لديه خبرة في التعافي يرشدك خلال الخطوات الـ12. يشاركك تجربته وقوته وأمله — لكنه لا يملي عليك ما تفعله. الراعي مرشد، ليس معالجاً أو والداً.'
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <BottomNav />
      <CrisisButton />
    </div>
  )
}
