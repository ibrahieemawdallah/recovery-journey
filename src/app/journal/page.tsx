'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { BottomNav } from '@/components/layout/BottomNav'
import { CrisisButton } from '@/components/layout/CrisisButton'
import { BookOpen, Plus, Edit, Trash2, Save, X, Calendar, Tag, Search, Filter, Heart, Sparkles, Moon, Sun, Cloud, CloudRain, Wind } from 'lucide-react'

interface JournalEntry {
  id: string
  title: string
  content: string
  mood: string
  tags: string[]
  createdAt: string
  updatedAt: string
}

const MOOD_OPTIONS = [
  { value: 'great', label: 'Great', labelAr: 'رائع', icon: Sun, color: 'text-yellow-500' },
  { value: 'good', label: 'Good', labelAr: 'جيد', icon: Cloud, color: 'text-blue-400' },
  { value: 'okay', label: 'Okay', labelAr: 'عادي', icon: Cloud, color: 'text-gray-400' },
  { value: 'low', label: 'Low', labelAr: 'منخفض', icon: CloudRain, color: 'text-blue-600' },
  { value: 'difficult', label: 'Difficult', labelAr: 'صعب', icon: Wind, color: 'text-red-500' },
]

const TAG_OPTIONS = ['gratitude', 'reflection', 'challenge', 'milestone', 'craving', 'growth', 'relationship', 'work']

export default function JournalPage() {
  const [language, setLanguage] = useState<'en' | 'ar'>('en')
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterMood, setFilterMood] = useState('all')
  const [newEntry, setNewEntry] = useState({
    title: '',
    content: '',
    mood: 'good',
    tags: [] as string[],
  })

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as 'en' | 'ar' | null
    if (savedLanguage) setLanguage(savedLanguage)

    const fetchEntries = async () => {
      try {
        const res = await fetch('/api/journal')
        if (!res.ok) throw new Error('Failed to fetch entries')
        const data = await res.json()
        if (data.success) {
          const parsedEntries = data.entries.map((entry: any) => ({
            ...entry,
            tags: typeof entry.tags === 'string' ? JSON.parse(entry.tags) : entry.tags
          }))
          setEntries(parsedEntries)
        }
      } catch (error) {
        console.error('Error fetching journal entries:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchEntries()
  }, [])

  const t = (en: string, ar: string) => language === 'en' ? en : ar

  const saveEntry = async () => {
    if (!newEntry.title.trim() || !newEntry.content.trim()) return

    try {
      const payload = {
        title: newEntry.title,
        content: newEntry.content,
        mood: newEntry.mood,
        tags: JSON.stringify(newEntry.tags),
      }

      let res: Response
      if (editingEntry) {
        res = await fetch('/api/journal', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingEntry.id, ...payload }),
        })
      } else {
        res = await fetch('/api/journal', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      }

      if (!res.ok) throw new Error('Failed to save entry')
      const data = await res.json()
      if (data.success) {
        const savedEntry = {
          ...data.entry,
          tags: typeof data.entry.tags === 'string' ? JSON.parse(data.entry.tags) : data.entry.tags
        }
        if (editingEntry) {
          setEntries(prev => prev.map(e => e.id === editingEntry.id ? savedEntry : e))
        } else {
          setEntries(prev => [savedEntry, ...prev])
        }
        closeDialog()
      }
    } catch (error) {
      console.error('Error saving journal entry:', error)
    }
  }

  const deleteEntry = async (id: string) => {
    try {
      const res = await fetch(`/api/journal?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Failed to delete entry')
      const data = await res.json()
      if (data.success) {
        setEntries(prev => prev.filter(e => e.id !== id))
      }
    } catch (error) {
      console.error('Error deleting journal entry:', error)
    }
  }

  const openDialog = (entry?: JournalEntry) => {
    if (entry) {
      setEditingEntry(entry)
      setNewEntry({ title: entry.title, content: entry.content, mood: entry.mood, tags: entry.tags })
    } else {
      setEditingEntry(null)
      setNewEntry({ title: '', content: '', mood: 'good', tags: [] })
    }
    setIsDialogOpen(true)
  }

  const closeDialog = () => {
    setIsDialogOpen(false)
    setEditingEntry(null)
    setNewEntry({ title: '', content: '', mood: 'good', tags: [] })
  }

  const toggleTag = (tag: string) => {
    setNewEntry(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) ? prev.tags.filter(t => t !== tag) : [...prev.tags, tag]
    }))
  }

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesMood = filterMood === 'all' || entry.mood === filterMood
    return matchesSearch && matchesMood
  })

  const getMoodIcon = (mood: string) => {
    const moodOption = MOOD_OPTIONS.find(m => m.value === mood)
    return moodOption?.icon || Cloud
  }

  const getMoodColor = (mood: string) => {
    const moodOption = MOOD_OPTIONS.find(m => m.value === mood)
    return moodOption?.color || 'text-gray-400'
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <BookOpen className="w-6 h-6" />
              {t('Journal', 'المفكرة')}
            </h1>
            <p className="text-muted-foreground">
              {t('Your personal recovery journal', 'مفكرة تعافيك الشخصية')}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}>
              {language === 'en' ? 'العربية' : 'English'}
            </Button>
            <Button onClick={() => openDialog()}>
              <Plus className="w-4 h-4 mr-2" />
              {t('New Entry', 'إدخال جديد')}
            </Button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={t('Search entries...', 'بحث في الإدخالات...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterMood} onValueChange={setFilterMood}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder={t('Filter by mood', 'تصفية حسب المزاج')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('All Moods', 'كل المزاجات')}</SelectItem>
              {MOOD_OPTIONS.map(mood => (
                <SelectItem key={mood.value} value={mood.value}>{t(mood.label, mood.labelAr)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Entries List */}
        {isLoading ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">{t('Loading...', 'جاري التحميل...')}</p>
            </CardContent>
          </Card>
        ) : filteredEntries.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">{t('No journal entries yet', 'لا توجد إدخالات في المفكرة بعد')}</p>
              <Button variant="outline" className="mt-4" onClick={() => openDialog()}>
                <Plus className="w-4 h-4 mr-2" />
                {t('Write Your First Entry', 'اكتب إدخالك الأول')}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredEntries.map((entry) => {
              const MoodIcon = getMoodIcon(entry.mood)
              return (
                <Card key={entry.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <MoodIcon className={`w-5 h-5 ${getMoodColor(entry.mood)}`} />
                          <CardTitle className="text-lg">{entry.title}</CardTitle>
                        </div>
                        <CardDescription className="flex items-center gap-2">
                          <Calendar className="w-3 h-3" />
                          {new Date(entry.createdAt).toLocaleDateString(language === 'en' ? 'en-US' : 'ar-SA', {
                            year: 'numeric', month: 'long', day: 'numeric'
                          })}
                        </CardDescription>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => openDialog(entry)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => deleteEntry(entry.id)}>
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3">{entry.content}</p>
                    {entry.tags.length > 0 && (
                      <div className="flex gap-2 mt-3">
                        {entry.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            <Tag className="w-3 h-3 mr-1" />
                            {t(tag, tag)}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      {/* Entry Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingEntry ? t('Edit Entry', 'تعديل الإدخال') : t('New Journal Entry', 'إدخال جديد')}</DialogTitle>
            <DialogDescription>
              {t('Write about your thoughts, feelings, and experiences', 'اكتب عن أفكارك ومشاعرك وتجاربك')}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">{t('Title', 'العنوان')}</Label>
              <Input
                id="title"
                placeholder={t('Give your entry a title', 'أعط إدخالك عنواناً')}
                value={newEntry.title}
                onChange={(e) => setNewEntry(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>{t('Mood', 'المزاج')}</Label>
              <div className="flex gap-2">
                {MOOD_OPTIONS.map(mood => (
                  <Button
                    key={mood.value}
                    variant={newEntry.mood === mood.value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setNewEntry(prev => ({ ...prev, mood: mood.value }))}
                  >
                    <mood.icon className={`w-4 h-4 mr-1 ${mood.color}`} />
                    {t(mood.label, mood.labelAr)}
                  </Button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">{t('Content', 'المحتوى')}</Label>
              <Textarea
                id="content"
                placeholder={t('What\'s on your mind?', 'ما الذي يدور في ذهنك؟')}
                value={newEntry.content}
                onChange={(e) => setNewEntry(prev => ({ ...prev, content: e.target.value }))}
                rows={8}
              />
            </div>
            <div className="space-y-2">
              <Label>{t('Tags', 'الوسوم')}</Label>
              <div className="flex flex-wrap gap-2">
                {TAG_OPTIONS.map(tag => (
                  <Button
                    key={tag}
                    variant={newEntry.tags.includes(tag) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => toggleTag(tag)}
                  >
                    {t(tag, tag)}
                  </Button>
                ))}
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={closeDialog}>
                <X className="w-4 h-4 mr-2" />
                {t('Cancel', 'إلغاء')}
              </Button>
              <Button onClick={saveEntry}>
                <Save className="w-4 h-4 mr-2" />
                {t('Save', 'حفظ')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <BottomNav />
      <CrisisButton />
    </div>
  )
}
