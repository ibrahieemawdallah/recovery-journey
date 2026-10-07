'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { BottomNav } from '@/components/layout/BottomNav'
import { CrisisButton } from '@/components/layout/CrisisButton'
import { Settings, Bell, Moon, Sun, Globe, Shield, Phone, Plus, Trash2, Save, AlertTriangle, Calendar, BookOpen, TrendingUp, Users, Award, MessageCircle, Mail, Smartphone, Volume2, Eye, Lock, Key, Database, Download, Upload, RefreshCw, Info, HelpCircle, FileText } from 'lucide-react'

const NOTIFICATION_PREFS = [
  { id: 'daily-checkin', label: 'Daily Check-in Reminder', description: 'Remind me to complete my daily check-in', icon: Calendar, default: true },
  { id: 'step-progress', label: 'Step Progress', description: 'Notify me about step milestones', icon: BookOpen, default: true },
  { id: 'mood-trends', label: 'Mood Insights', description: 'Weekly mood trend reports', icon: TrendingUp, default: false },
  { id: 'community', label: 'Community Updates', description: 'New messages and community activity', icon: Users, default: true },
  { id: 'achievements', label: 'Achievement Alerts', description: 'When I earn new achievements', icon: Award, default: true },
]

const DEFAULT_EMERGENCY_CONTACTS = [
  { id: '1', name: 'Sponsor - John', phone: '+1 (555) 123-4567', relationship: 'Sponsor' },
  { id: '2', name: 'Therapist - Dr. Smith', phone: '+1 (555) 987-6543', relationship: 'Therapist' },
  { id: '3', name: 'Emergency Hotline', phone: '1-800-662-4357', relationship: 'Helpline' },
]

interface User {
  id: string
  email: string
  name: string
  bio: string | null
  skills: string | null
  preferences: string | null
  location: string | null
  isAvailable: boolean
}

interface Preferences {
  theme?: string
  notifications?: Record<string, boolean>
  emergencyContacts?: Array<{ id: string; name: string; phone: string; relationship: string }>
}

export default function SettingsPage() {
  const [language, setLanguage] = useState<'en' | 'ar'>('en')
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system')
  const [notifications, setNotifications] = useState<Record<string, boolean>>({})
  const [emergencyContacts, setEmergencyContacts] = useState(DEFAULT_EMERGENCY_CONTACTS)
  const [newContact, setNewContact] = useState({ name: '', phone: '', relationship: '' })
  const [isAddingContact, setIsAddingContact] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as 'en' | 'ar' | null
    if (savedLanguage) setLanguage(savedLanguage)

    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system' | null
    if (savedTheme) setTheme(savedTheme)

    const savedNotifications = localStorage.getItem('notificationPrefs')
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications))
    } else {
      const defaults: Record<string, boolean> = {}
      NOTIFICATION_PREFS.forEach(pref => { defaults[pref.id] = pref.default })
      setNotifications(defaults)
    }

    const savedContacts = localStorage.getItem('emergencyContacts')
    if (savedContacts) setEmergencyContacts(JSON.parse(savedContacts))

    const loadUser = async () => {
      setIsLoading(true)
      try {
        const res = await fetch('/api/auth/me')
        const data = await res.json()
        if (data.success) {
          setUser(data.user)
          if (data.user.preferences) {
            const prefs: Preferences = JSON.parse(data.user.preferences)
if (prefs.theme) {
                setTheme((prefs.theme as 'system' | 'light' | 'dark') || 'system')
                localStorage.setItem('theme', prefs.theme)
              }
            if (prefs.notifications) {
              setNotifications(prefs.notifications)
              localStorage.setItem('notificationPrefs', JSON.stringify(prefs.notifications))
            }
            if (prefs.emergencyContacts) {
              setEmergencyContacts(prefs.emergencyContacts)
              localStorage.setItem('emergencyContacts', JSON.stringify(prefs.emergencyContacts))
            }
          }
        } else {
          console.error('Failed to load user:', data.error)
        }
      } catch (err) {
        console.error('Error loading user:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()
  }, [])

  const savePreferences = async (prefs: Preferences) => {
    if (!user?.email) return

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          preferences: prefs,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setUser(data.user)
      } else {
        console.error('Failed to save preferences:', data.error)
      }
    } catch (err) {
      console.error('Error saving preferences:', err)
    }
  }

  const t = (en: string, ar: string) => language === 'en' ? en : ar

  const toggleNotification = (id: string) => {
    const updated = { ...notifications, [id]: !notifications[id] }
    setNotifications(updated)
    localStorage.setItem('notificationPrefs', JSON.stringify(updated))
    savePreferences({ theme, notifications: updated, emergencyContacts })
  }

  const changeTheme = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    savePreferences({ theme: newTheme, notifications, emergencyContacts })
    // Apply theme to document
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else if (newTheme === 'light') {
      document.documentElement.classList.remove('dark')
    } else {
      // System preference
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
  }

  const changeLanguage = (newLang: 'en' | 'ar') => {
    setLanguage(newLang)
    localStorage.setItem('language', newLang)
    document.documentElement.lang = newLang
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr'
  }

  const addContact = () => {
    if (!newContact.name || !newContact.phone) return
    const contact = { id: Date.now().toString(), ...newContact }
    const updated = [...emergencyContacts, contact]
    setEmergencyContacts(updated)
    localStorage.setItem('emergencyContacts', JSON.stringify(updated))
    savePreferences({ theme, notifications, emergencyContacts: updated })
    setNewContact({ name: '', phone: '', relationship: '' })
    setIsAddingContact(false)
  }

  const removeContact = (id: string) => {
    const updated = emergencyContacts.filter(c => c.id !== id)
    setEmergencyContacts(updated)
    localStorage.setItem('emergencyContacts', JSON.stringify(updated))
    savePreferences({ theme, notifications, emergencyContacts: updated })
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Settings className="w-6 h-6" />
              {t('Settings', 'الإعدادات')}
            </h1>
            <p className="text-muted-foreground">
              {t('Customize your recovery experience', 'خصص تجربة التعافي الخاصة بك')}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => changeLanguage(language === 'en' ? 'ar' : 'en')}>
            {language === 'en' ? 'العربية' : 'English'}
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="general" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="general">{t('General', 'عام')}</TabsTrigger>
            <TabsTrigger value="notifications">{t('Notifications', 'الإشعارات')}</TabsTrigger>
            <TabsTrigger value="emergency">{t('Emergency', 'الطوارئ')}</TabsTrigger>
            <TabsTrigger value="privacy">{t('Privacy', 'الخصوصية')}</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            {/* Language */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  {t('Language', 'اللغة')}
                </CardTitle>
                <CardDescription>{t('Choose your preferred language', 'اختر لغتك المفضلة')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3">
                  <Button
                    variant={language === 'en' ? 'default' : 'outline'}
                    className="flex-1"
                    onClick={() => changeLanguage('en')}
                  >
                    English
                  </Button>
                  <Button
                    variant={language === 'ar' ? 'default' : 'outline'}
                    className="flex-1"
                    onClick={() => changeLanguage('ar')}
                  >
                    العربية
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Theme */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                  {t('Theme', 'المظهر')}
                </CardTitle>
                <CardDescription>{t('Choose your preferred theme', 'اختر المظهر المفضل')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3">
                  <Button
                    variant={theme === 'light' ? 'default' : 'outline'}
                    className="flex-1"
                    onClick={() => changeTheme('light')}
                  >
                    <Sun className="w-4 h-4 mr-2" />
                    {t('Light', 'فاتح')}
                  </Button>
                  <Button
                    variant={theme === 'dark' ? 'default' : 'outline'}
                    className="flex-1"
                    onClick={() => changeTheme('dark')}
                  >
                    <Moon className="w-4 h-4 mr-2" />
                    {t('Dark', 'داكن')}
                  </Button>
                  <Button
                    variant={theme === 'system' ? 'default' : 'outline'}
                    className="flex-1"
                    onClick={() => changeTheme('system')}
                  >
                    {t('System', 'النظام')}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Data Management */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  {t('Data Management', 'إدارة البيانات')}
                </CardTitle>
                <CardDescription>{t('Export or import your recovery data', 'تصدير أو استيراد بيانات التعافي')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Download className="w-4 h-4 mr-2" />
                  {t('Export Data', 'تصدير البيانات')}
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Upload className="w-4 h-4 mr-2" />
                  {t('Import Data', 'استيراد البيانات')}
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  {t('Sync Data', 'مزامنة البيانات')}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  {t('Notification Preferences', 'تفضيلات الإشعارات')}
                </CardTitle>
                <CardDescription>{t('Choose what notifications you receive', 'اختر الإشعارات التي تتلقاها')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {NOTIFICATION_PREFS.map((pref) => (
                  <div key={pref.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                        <pref.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{t(pref.label, pref.label)}</p>
                        <p className="text-xs text-muted-foreground">{t(pref.description, pref.description)}</p>
                      </div>
                    </div>
                    <Switch
                      checked={notifications[pref.id] ?? false}
                      onCheckedChange={() => toggleNotification(pref.id)}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Notification Channels */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5" />
                  {t('Notification Channels', 'قنوات الإشعارات')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-muted-foreground" />
                    <span className="text-sm font-medium">{t('Email Notifications', 'إشعارات البريد الإلكتروني')}</span>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <MessageCircle className="w-5 h-5 text-muted-foreground" />
                    <span className="text-sm font-medium">{t('Push Notifications', 'إشعارات الدفع')}</span>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Volume2 className="w-5 h-5 text-muted-foreground" />
                    <span className="text-sm font-medium">{t('Sound', 'الصوت')}</span>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="emergency" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  {t('Emergency Contacts', 'جهات اتصال الطوارئ')}
                </CardTitle>
                <CardDescription>{t('People to contact in case of emergency', 'أشخاص يمكن الاتصال بهم في حالة الطوارئ')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {emergencyContacts.map((contact) => (
                  <div key={contact.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                        <Phone className="w-5 h-5 text-destructive" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{contact.name}</p>
                        <p className="text-xs text-muted-foreground">{contact.phone} • {contact.relationship}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => removeContact(contact.id)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                ))}

                {isAddingContact ? (
                  <div className="p-4 border rounded-lg space-y-3">
                    <div className="space-y-2">
                      <Label>{t('Name', 'الاسم')}</Label>
                      <Input
                        placeholder={t('Contact name', 'اسم جهة الاتصال')}
                        value={newContact.name}
                        onChange={(e) => setNewContact(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{t('Phone', 'الهاتف')}</Label>
                      <Input
                        placeholder={t('Phone number', 'رقم الهاتف')}
                        value={newContact.phone}
                        onChange={(e) => setNewContact(prev => ({ ...prev, phone: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{t('Relationship', 'العلاقة')}</Label>
                      <Input
                        placeholder={t('e.g. Sponsor, Therapist', 'مثال: كفيل، معالج')}
                        value={newContact.relationship}
                        onChange={(e) => setNewContact(prev => ({ ...prev, relationship: e.target.value }))}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => setIsAddingContact(false)}>
                        {t('Cancel', 'إلغاء')}
                      </Button>
                      <Button onClick={addContact}>
                        <Save className="w-4 h-4 mr-2" />
                        {t('Save', 'حفظ')}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button variant="outline" className="w-full" onClick={() => setIsAddingContact(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    {t('Add Contact', 'إضافة جهة اتصال')}
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Crisis Resources */}
            <Card className="border-destructive/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <AlertTriangle className="w-5 h-5" />
                  {t('Crisis Resources', 'موارد الأزمات')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-4 bg-destructive/10 rounded-lg">
                  <p className="font-medium text-destructive">
                    {t('SAMHSA National Helpline', 'خط المساعدة الوطني SAMHSA')}
                  </p>
                  <p className="text-sm text-destructive dark:text-destructive">1-800-662-4357</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {t('Free, confidential, 24/7 treatment referral', 'مجاني وسري ومتاح على مدار الساعة')}
                  </p>
                </div>
                <div className="p-4 bg-destructive/10 rounded-lg">
                  <p className="font-medium text-destructive">
                    {t('Crisis Text Line', 'خط نص الأزمات')}
                  </p>
                  <p className="text-sm text-destructive dark:text-destructive">Text HOME to 741741</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {t('Free, 24/7 crisis support via text', 'دعم أزمات مجاني على مدار الساعة عبر النص')}
                  </p>
                </div>
                <div className="p-4 bg-destructive/10 rounded-lg">
                  <p className="font-medium text-destructive">
                    {t('Emergency Services', 'خدمات الطوارئ')}
                  </p>
                  <p className="text-sm text-destructive dark:text-destructive">911</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {t('For immediate emergency assistance', 'للمساعدة الطارئة الفورية')}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  {t('Privacy & Security', 'الخصوصية والأمان')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Eye className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-sm">{t('Profile Visibility', 'ظهور الملف الشخصي')}</p>
                      <p className="text-xs text-muted-foreground">{t('Control who can see your profile', 'التحكم في من يمكنه رؤية ملفك الشخصي')}</p>
                    </div>
                  </div>
                  <Select defaultValue="private">
                    <SelectTrigger className="w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="private">{t('Private', 'خاص')}</SelectItem>
                      <SelectItem value="friends">{t('Friends', 'الأصدقاء')}</SelectItem>
                      <SelectItem value="public">{t('Public', 'عام')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Key className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-sm">{t('Change Password', 'تغيير كلمة المرور')}</p>
                      <p className="text-xs text-muted-foreground">{t('Update your account password', 'تحديث كلمة مرور حسابك')}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    {t('Change', 'تغيير')}
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-sm">{t('Two-Factor Authentication', 'المصادقة الثنائية')}</p>
                      <p className="text-xs text-muted-foreground">{t('Add an extra layer of security', 'أضف طبقة أمان إضافية')}</p>
                    </div>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Database className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-sm">{t('Data & Analytics', 'البيانات والتحليلات')}</p>
                      <p className="text-xs text-muted-foreground">{t('Manage your data and analytics preferences', 'إدارة تفضيلات البيانات والتحليلات')}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    {t('Manage', 'إدارة')}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* About */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="w-5 h-5" />
                  {t('About', 'حول')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3">
                  <span className="text-sm">{t('Version', 'الإصدار')}</span>
                  <Badge variant="secondary">1.0.0</Badge>
                </div>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  {t('Terms of Service', 'شروط الخدمة')}
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Shield className="w-4 h-4 mr-2" />
                  {t('Privacy Policy', 'سياسة الخصوصية')}
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <HelpCircle className="w-4 h-4 mr-2" />
                  {t('Help & Support', 'المساعدة والدعم')}
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
