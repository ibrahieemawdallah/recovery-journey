'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Mail, Lock, User, UserPlus } from 'lucide-react'
import { LogoVideo } from '@/components/brand/logo-video'

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [language, setLanguage] = useState<'en' | 'ar'>('en')

  const t = (en: string, ar: string) => language === 'en' ? en : ar

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError(t('Passwords do not match', 'كلمتا المرور غير متطابقتين'))
      return
    }

    if (password.length < 8) {
      setError(t('Password must be at least 8 characters', 'كلمة المرور يجب أن تكون 8 أحرف على الأقل'))
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })
      const data = await res.json()

      if (data.success) {
        localStorage.setItem('userId', data.user.email)
        // A full navigation, not router.push(). The session cookie arrives in
        // this response; a client-side push can race it and reach the
        // middleware before the cookie is stored, bouncing the new user back
        // to /landing as if the registration had failed.
        window.location.href = '/'
      } else {
        setError(data.error || t('Registration failed', 'فشل التسجيل'))
      }
    } catch {
      setError(t('Network error', 'خطأ في الشبكة'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent to-accent dark:from-foreground/10 dark:to-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="relative w-20 h-20">
              <div className="absolute -inset-3 rounded-2xl bg-primary/20 blur-xl" aria-hidden />
              <LogoVideo
                className="relative h-20 w-20 rounded-2xl ring-1 ring-primary/20 shadow-lg"
                ariaLabel={t('Recovery Journey logo', 'شعار رحلة التعافي')}
              />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">{t('Create Account', 'إنشاء حساب')}</CardTitle>
          <CardDescription>{t('Start your recovery journey today', 'ابدأ رحلة التعافي اليوم')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t('Full Name', 'الاسم الكامل')}</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="name"
                  placeholder={t('Enter your name', 'أدخل اسمك')}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{t('Email', 'البريد الإلكتروني')}</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder={t('you@example.com', 'you@example.com')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                  dir="ltr"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{t('Password', 'كلمة المرور')}</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder={t('At least 8 characters', '8 أحرف على الأقل')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                  minLength={8}
                  dir="ltr"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{t('Confirm Password', 'تأكيد كلمة المرور')}</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder={t('Re-enter your password', 'أعد إدخال كلمة المرور')}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10"
                  required
                  dir="ltr"
                />
              </div>
            </div>

            {error && (
              <p className="text-sm text-destructive text-center">{error}</p>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              <UserPlus className="w-4 h-4 mr-2" />
              {loading ? t('Creating account...', 'جارٍ إنشاء الحساب...') : t('Create Account', 'إنشاء حساب')}
            </Button>
          </form>

          <div className="mt-6 text-center space-y-3">
            <p className="text-sm text-muted-foreground">
              {t('Already have an account?', 'لديك حساب بالفعل؟')}
            </p>
            <Button variant="outline" className="w-full" onClick={() => router.push('/login')}>
              {t('Sign In', 'تسجيل الدخول')}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}>
              {language === 'en' ? 'العربية' : 'English'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
