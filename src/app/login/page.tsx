'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Mail, Lock, LogIn } from 'lucide-react'
import { LogoVideo } from '@/components/brand/logo-video'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [language, setLanguage] = useState<'en' | 'ar'>('en')

  const t = (en: string, ar: string) => language === 'en' ? en : ar

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()

      if (data.success) {
        localStorage.setItem('userId', data.user.email)
        router.push('/')
      } else {
        setError(data.error || t('Login failed', 'فشل تسجيل الدخول'))
      }
    } catch {
      setError(t('Network error', 'خطأ في الشبكة'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="relative w-20 h-20">
              <div className="absolute -inset-3 rounded-2xl bg-emerald-400/20 blur-xl" aria-hidden />
              <LogoVideo
                className="relative h-20 w-20 rounded-2xl ring-1 ring-emerald-500/20 shadow-lg"
                ariaLabel={t('Recovery Journey logo', 'شعار رحلة التعافي')}
              />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">{t('Welcome Back', 'مرحباً بعودتك')}</CardTitle>
          <CardDescription>{t('Sign in to continue your recovery journey', 'سجل الدخول لمتابعة رحلة التعافي')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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
                  placeholder={t('Enter your password', 'أدخل كلمة المرور')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
              <LogIn className="w-4 h-4 mr-2" />
              {loading ? t('Signing in...', 'جارٍ تسجيل الدخول...') : t('Sign In', 'تسجيل الدخول')}
            </Button>
          </form>

          <div className="mt-6 text-center space-y-3">
            <p className="text-sm text-muted-foreground">
              {t("Don't have an account?", 'ليس لديك حساب؟')}
            </p>
            <Button variant="outline" className="w-full" onClick={() => router.push('/register')}>
              {t('Create Account', 'إنشاء حساب')}
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
