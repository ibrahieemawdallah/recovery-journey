'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BottomNav } from '@/components/layout/BottomNav'
import { CrisisButton } from '@/components/layout/CrisisButton'
import { Search, BookOpen, FileText, Video, Headphones, ExternalLink, Star, Clock, User, Filter, Heart, Brain, Shield, Users, Target, Sparkles, Award, Calendar, Activity, Wind, Sun, Moon, Zap, Leaf, Anchor, Droplets, Eye, Hand, Footprints, Music, Loader2 } from 'lucide-react'

const RESOURCE_CATEGORIES = [
  { id: 'all', label: 'All', labelAr: 'الكل' },
  { id: 'articles', label: 'Articles', labelAr: 'مقالات' },
  { id: 'guides', label: 'Guides', labelAr: 'أدلة' },
  { id: 'videos', label: 'Videos', labelAr: 'فيديوهات' },
  { id: 'audio', label: 'Audio', labelAr: 'صوتيات' },
  { id: 'tools', label: 'Tools', labelAr: 'أدوات' },
]

interface Resource {
  id: string
  title: string
  description: string
  category: string
  url: string | null
  views: number
  helpful: number
  author: { id: string; name: string } | null
}

export default function ResourcesPage() {
  const [language, setLanguage] = useState<'en' | 'ar'>('en')
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [favorites, setFavorites] = useState<string[]>([])
  const [resources, setResources] = useState<Resource[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as 'en' | 'ar' | null
    if (savedLanguage) setLanguage(savedLanguage)

    const savedFavorites = localStorage.getItem('resourceFavorites')
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites))
  }, [])

  useEffect(() => {
    const fetchResources = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const params = new URLSearchParams()
        if (searchQuery) params.set('search', searchQuery)
        if (activeCategory && activeCategory !== 'all') params.set('category', activeCategory)

        const res = await fetch(`/api/resources?${params.toString()}`)
        const data = await res.json()
        if (data.success) {
          setResources(data.resources)
        } else {
          setError(data.error || 'Failed to fetch resources')
          console.error('Failed to fetch resources:', data.error)
        }
      } catch (err) {
        setError('Failed to fetch resources')
        console.error('Error fetching resources:', err)
      } finally {
        setIsLoading(false)
      }
    }

    const debounceTimer = setTimeout(fetchResources, 300)
    return () => clearTimeout(debounceTimer)
  }, [searchQuery, activeCategory])

  const t = (en: string, ar: string) => language === 'en' ? en : ar

  const toggleFavorite = (id: string) => {
    const newFavorites = favorites.includes(id)
      ? favorites.filter(f => f !== id)
      : [...favorites, id]
    setFavorites(newFavorites)
    localStorage.setItem('resourceFavorites', JSON.stringify(newFavorites))
  }

  const featuredResources = resources.slice(0, 3)

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'articles': return FileText
      case 'guides': return BookOpen
      case 'videos': return Video
      case 'audio': return Headphones
      case 'tools': return Target
      default: return BookOpen
    }
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <BookOpen className="w-6 h-6" />
              {t('Resources', 'المصادر')}
            </h1>
            <p className="text-muted-foreground">
              {t('Educational materials and recovery resources', 'مواد تعليمية وموارد تعافي')}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}>
            {language === 'en' ? 'العربية' : 'English'}
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder={t('Search resources...', 'بحث في المصادر...')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Featured Resources */}
        {activeCategory === 'all' && !searchQuery && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500" />
              {t('Featured Resources', 'مصادر مميزة')}
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {featuredResources.map((resource) => {
                const Icon = getCategoryIcon(resource.category)
                return (
                  <Card key={resource.id} className="border-amber-200 dark:border-amber-800">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <Icon className="w-8 h-8 text-amber-500" />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleFavorite(resource.id)}
                        >
                          <Star className={`w-4 h-4 ${favorites.includes(resource.id) ? 'fill-amber-500 text-amber-500' : 'text-muted-foreground'}`} />
                        </Button>
                      </div>
                      <CardTitle className="text-base">{resource.title}</CardTitle>
                      <CardDescription className="line-clamp-2">{resource.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <User className="w-3 h-3" />
                          {resource.author?.name || 'Unknown'}
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                          {resource.helpful}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )}

        {/* Category Tabs */}
        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-6">
            {RESOURCE_CATEGORIES.map((cat) => (
              <TabsTrigger key={cat.id} value={cat.id}>
                {t(cat.label, cat.labelAr)}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeCategory} className="space-y-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            ) : error ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-red-500">{error}</p>
                </CardContent>
              </Card>
            ) : resources.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Search className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">{t('No resources found', 'لم يتم العثور على مصادر')}</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {resources.map((resource) => {
                  const Icon = getCategoryIcon(resource.category)
                  return (
                    <Card key={resource.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <Icon className="w-8 h-8 text-primary" />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleFavorite(resource.id)}
                          >
                            <Star className={`w-4 h-4 ${favorites.includes(resource.id) ? 'fill-amber-500 text-amber-500' : 'text-muted-foreground'}`} />
                          </Button>
                        </div>
                        <CardTitle className="text-base">{resource.title}</CardTitle>
                        <CardDescription className="line-clamp-2">{resource.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <User className="w-3 h-3" />
                              {resource.author?.name || 'Unknown'}
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                              {resource.helpful}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">{t(resource.category, resource.category)}</Badge>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {resource.views}
                            </span>
                          </div>
                          <Button variant="outline" size="sm" className="w-full" onClick={() => resource.url && window.open(resource.url, '_blank')}>
                            {t('Read More', 'اقرأ المزيد')}
                            <ExternalLink className="w-3 h-3 ml-2" />
                          </Button>
                        </div>
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
