'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { LogoVideo } from '@/components/brand/logo-video'
import { TreeLogoMark } from '@/components/brand/tree-logo-mark'
import {
  Brain, BookOpen, MessageCircle, Users, Shield, Wind, Heart, Sparkles,
  ArrowRight, Check, Lock, Activity, Calendar, LineChart,
  Smartphone, CheckCircle2, Menu, X,
} from 'lucide-react'

const COPY = {
  en: {
    nav: { features: 'Features', steps: '12 Steps', clinical: 'Clinical tools', faq: 'FAQ' },
    hero: {
      badge: 'Evidence-based · Private · Free',
      title: 'Your recovery journey,',
      titleAccent: 'one day at a time.',
      sub: 'A complete recovery companion: the 12 steps, clinical tools for CBT and DBT, an AI coach that is there at 3am, and a community that does not judge.',
      cta: 'Start your journey',
      cta2: 'Take a look around',
      note: 'Completely free · No credit card · Works offline',
    },
    features: {
      title: 'Everything recovery asks of you',
      sub: 'One app instead of six tabs, a notes file, and a phone call at the wrong time.',
    },
    items: [
      { icon: BookOpen, en: 'The 12 steps', ar: 'الخطوات الاثنتا عشرة', dEn: 'Work through every step with guided reflection, written amends and daily practices.', dAr: 'اعمل على كل خطوة مع تأملات موجهة واعتذارات مكتوبة وممارسات يومية.' },
      { icon: Brain, en: 'Clinical tools', ar: 'الأدوات السريرية', dEn: 'CBT and DBT exercises, thought records, urge surfing and relapse prevention plans.', dAr: 'تمارين CBT و DBT وسجلات الأفكار ومواجهة الرغبة وخطط منع الانتكاس.' },
      { icon: MessageCircle, en: 'AI recovery coach', ar: 'مدرب التعافي الذكي', dEn: 'Available at any hour. It listens, remembers your plan, and never tells you what to do.', dAr: 'متاح في أي وقت. يستمع، ويحفظ خطتك، ولا يملي عليك ما تفعله.' },
      { icon: Users, en: 'Community circles', ar: 'دوائر المجتمع', dEn: 'Match with people at the same stage — early recovery, long term, working professionals.', dAr: 'تواصل مع أشخاص في نفس المرحلة — التعافي المبكر، طويل المدى، المهنيون.' },
      { icon: Activity, en: 'Track what matters', ar: 'تتبّع ما يهم', dEn: 'Sobriety counter, mood trends, triggers, streaks and streaks you can actually see.', dAr: 'عدّاد التعافي، اتجاهات المزاج، المحفزات، والسلاسل التي تراها بوضوح.' },
      { icon: Shield, en: 'Crisis support', ar: 'دعم الأزمات', dEn: 'One tap to hotlines, grounding exercises and a safety plan you wrote in advance.', dAr: 'نقرة واحدة على خطوط الدعم، وتمارين تهدئة، وخطة أمان كتبتها مسبقاً.' },
    ],
    steps: {
      title: 'The 12 steps, in your language',
      sub: 'Each step with reflection prompts, daily practices and a journal entry space.',
      titleAr: 'الخطوات الاثنتا عشرة بلغتك',
      subAr: 'كلخطوة مع تأملات، وممارسات يومية، ومكان للمفكرة.',
    },
    stats: [
      { value: '12', label: 'steps, fully supported' },
      { value: '9', label: 'clinical & daily tools' },
      { value: '24/7', label: 'AI coach availability' },
      { value: '100%', label: 'private and free' },
    ],
    stepsList: [
      'Admitted we were powerless over our addiction',
      'Believed a power greater than ourselves could restore us',
      'Made a decision to turn our will over',
      'Made a searching and fearless moral inventory',
      'Admitted to God, ourselves and another person the exact nature of our wrongs',
      'Were entirely ready to have our defects removed',
      'Humbly asked for our shortcomings to be removed',
      'Made a list of all persons we had harmed',
      'Made direct amends wherever possible',
      'Continued to take personal inventory',
      'Sought through prayer and meditation to improve our contact',
      'Carried the message to others and practiced these principles',
    ],
    testimonial: {
      quote: 'I used three apps and a notebook. The sobriety counter was the only thing that kept me honest — here it is, with everything else around it.',
      author: 'Long-term recovery · 4 years',
    },
    cta: {
      title: 'Start today, privately, on your own phone',
      sub: 'Five short steps and you are in. No account, no payment, no waiting.',
      button: 'Begin now',
    },
    faq: [
      { q: 'Is this really free?', a: 'Yes. Every tool — the 12 steps, clinical exercises, journal, AI coach and community — is available without payment.' },
      { q: 'Is my data private?', a: 'Your journal entries and check-ins stay on your device unless you explicitly choose to share something with a circle.' },
      { q: 'Do I need to be religious?', a: 'No. The 12 steps are offered in secular, spiritual and faith-based framings — pick the one that fits you.' },
      { q: 'What if I relapse?', a: 'The app treats a relapse as data, not failure. Your counter resets, your streak history stays, and the coach helps you build the next plan.' },
    ],
    footer: 'Recovery Journey · رفيق التعافي — built for people in recovery, with their families.',
  },
  ar: {
    nav: { features: 'المميزات', steps: 'الخطوات ١٢', clinical: 'الأدوات السريرية', faq: 'أسئلة' },
    hero: {
      badge: 'مبني على الأدلة · خاص · مجاني',
      title: 'رحلة تعافيك،',
      titleAccent: 'يوماً بعد يوم.',
      sub: 'رفيق تعافي متكامل: الخطوات الاثنتي عشرة، وأدوات CBT و DBT، ومدرب ذكي متاح في الثالثة فجراً، ومجتمع لا يحكم.',
      cta: 'ابدأ رحلتك',
      cta2: 'تعرّف على التطبيق',
      note: 'مجاني بالكامل · بدون بطاقة ائتمان · يعمل بدون إنترنت',
    },
    features: {
      title: 'كل ما يحتاجه التعافي منك',
      sub: 'تطبيق واحد بدل ستة تبويبات وملف ملاحظات ومكالمة في وقت غير مناسب.',
    },
    items: [
      { icon: BookOpen, en: 'The 12 steps', ar: 'الخطوات الاثنتا عشرة', dEn: '', dAr: 'اعمل على كل خطوة مع تأملات موجهة واعتذارات مكتوبة وممارسات يومية.' },
      { icon: Brain, en: 'Clinical tools', ar: 'الأدوات السريرية', dEn: '', dAr: 'تمارين CBT و DBT وسجلات الأفكار ومواجهة الرغبة وخطط منع الانتكاس.' },
      { icon: MessageCircle, en: 'AI recovery coach', ar: 'مدرب التعافي الذكي', dEn: '', dAr: 'متاح في أي وقت. يستمع، ويحفظ خطتك، ولا يملي عليك ما تفعله.' },
      { icon: Users, en: 'Community circles', ar: 'دوائر المجتمع', dEn: '', dAr: 'تواصل مع أشخاص في نفس المرحلة — التعافي المبكر، طويل المدى، المهنيون.' },
      { icon: Activity, en: 'Track what matters', ar: 'تتبّع ما يهم', dEn: '', dAr: 'عدّاد التعافي، اتجاهات المزاج، المحفزات، والسلاسل التي تراها بوضوح.' },
      { icon: Shield, en: 'Crisis support', ar: 'دعم الأزمات', dEn: '', dAr: 'نقرة واحدة على خطوط الدعم، وتمارين تهدئة، وخطة أمان كتبتها مسبقاً.' },
    ],
    steps: {
      title: 'الخطوات الاثنتا عشرة، بلغتك',
      sub: 'كل خطوة مع أسئلة تأمل، وممارسات يومية، ومكان للمفكرة.',
      titleAr: 'الخطوات الاثنتا عشرة، بلغتك',
      subAr: 'كل خطوة مع تأملات، وممارسات يومية، ومكان للمفكرة.',
    },
    stats: [
      { value: '12', label: 'خطوة مدعومة بالكامل' },
      { value: '9', label: 'أداة سريرية ويومية' },
      { value: '24/7', label: 'توفر المدرب الذكي' },
      { value: '100%', label: 'خصوصية ومجاناً' },
    ],
    stepsList: [],
    testimonial: {
      quote: 'كنت أستخدم ثلاثة تطبيقات ودفتراً. عدّاد التعافي كان الشيء الوحيد الذي يجعلني صادقاً مع نفسي — وهو هنا، ومعه كل شيء.',
      author: 'تعافي طويل المدى · ٤ سنوات',
    },
    cta: {
      title: 'ابدأ اليوم، بخصوصية، من هاتفك',
      sub: 'خمس خطوات قصيرة وتكون داخل التطبيق. بدون حساب، وبدون دفع، وبدون انتظار.',
      button: 'ابدأ الآن',
    },
    faq: [
      { q: 'هل هو مجاني فعلاً؟', a: 'نعم. كل الأدوات — الخطوات الاثنتا عشرة، التمارين السريرية، المفكرة، المدرب الذكي والمجتمع — متاحة بدون أي مقابل.' },
      { q: 'هل بياناتي خاصة؟', a: 'تدخلاتك في المفكرة والتسجيلات تبقى على جهازك، إلا إذا اخترت عمداً مشاركة شيء مع دائرة.' },
      { q: 'هل يجب أن أكون متديناً؟', a: 'لا. تُقدَّم الخطوات الاثنتا عشرة بثلاث صيغ: علمانية، وروحية، ودينية — اختر ما يناسبك.' },
      { q: 'ماذا لو انتكست؟', a: 'التطبيق يعتبر الانتكاسة بيانات لا فشلاً. يُعاد ضبط العدّاد، ويبقى سجل سلاسلك، ويساعدك المدرب على بناء الخطة التالية.' },
    ],
    footer: 'رحلة التعافي — رفيق التعافي: مصنوع لأشخاص في التعافي، ولعائلاتهم.',
  },
}

const STEP_LABELS_AR = [
  'اعترفنا بعجزنا أمام الإدمان',
  'آمنا أن قوة أكبر منّا تستطيع شفاءنا',
  'قرّرنا أن نسلّم إرادتنا',
  'أجرينا حصراً أخلاقياً شجاعاً وشاملاً',
  'اعترفنا لله وبأنفسنا وشخص آخر بطبيعة أخطائنا',
  'كنا مستعدين تماماً للتخلص من عيوبنا',
  'تواضعنا وطلبنا إزالة عيوبنا',
  'أعدنا قائمة بكل من أذينا',
  'اعتذرنا مباشرة كلما أمكن',
  'واصلنا الحصر الشخصي',
  'سعينا بالصلة والصلاة لتحسين تواصلنا',
  'حملنا الرسالة إلى الآخرين وطبّقنا هذه المبادئ',
]

export default function LandingPage() {
  const router = useRouter()
  const [language, setLanguage] = useState<'en' | 'ar'>('en')
  const [menuOpen, setMenuOpen] = useState(false)
  const c = COPY[language]
  const ar = language === 'ar'

  useEffect(() => {
    const saved = localStorage.getItem('language') as 'en' | 'ar' | null
    if (saved) setLanguage(saved)
    document.documentElement.lang = language
    document.documentElement.dir = ar ? 'rtl' : 'ltr'
  }, [language, ar])

  const switchTo = (l: 'en' | 'ar') => {
    setLanguage(l)
    localStorage.setItem('language', l)
    setMenuOpen(false)
  }

  const stepList = ar ? STEP_LABELS_AR : c.stepsList

  return (
    <div className="min-h-screen bg-background" dir={ar ? 'rtl' : 'ltr'}>
      {/* ---------------- nav ---------------- */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4">
          <TreeLogoMark className="h-10 w-10 shrink-0" title="Recovery Journey" />
          <span className="hidden text-sm font-semibold tracking-tight sm:block">
            {ar ? 'رحلة التعافي' : 'Recovery Journey'}
          </span>

          <nav className="ml-auto hidden items-center gap-6 text-sm md:flex">
            <a href="#features" className="text-muted-foreground transition hover:text-foreground">{c.nav.features}</a>
            <a href="#steps" className="text-muted-foreground transition hover:text-foreground">{c.nav.steps}</a>
            <a href="#faq" className="text-muted-foreground transition hover:text-foreground">{c.nav.faq}</a>
          </nav>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => switchTo(ar ? 'en' : 'ar')}
            className="ml-auto md:ml-0"
          >
            {ar ? 'English' : 'العربية'}
          </Button>

          <Button size="sm" className="hidden sm:inline-flex" onClick={() => router.push('/onboarding')}>
            {ar ? 'ابدأ' : 'Get started'}
          </Button>

          <button
            className="rounded-md p-2 md:hidden"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {menuOpen && (
          <div className="border-t border-border/60 bg-background md:hidden">
            <div className="flex flex-col gap-1 px-4 py-3 text-sm">
              {(['features', 'steps', 'faq'] as const).map((k) => (
                <a
                  key={k}
                  href={`#${k}`}
                  onClick={() => setMenuOpen(false)}
                  className="rounded px-2 py-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                >
                  {c.nav[k]}
                </a>
              ))}
              <Button size="sm" className="mt-2" onClick={() => router.push('/onboarding')}>
                {ar ? 'ابدأ رحلتك' : 'Start your journey'}
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* ---------------- hero ---------------- */}
      <section className="relative overflow-hidden py-14 md:py-20">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(760px 520px at 78% 22%, color-mix(in oklab, var(--accent) 60%, transparent), transparent 68%), radial-gradient(620px 460px at 8% 82%, color-mix(in oklab, var(--primary) 8%, transparent), transparent 70%)',
            backgroundRepeat: 'no-repeat',
          }}
          aria-hidden
        />

        <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-4 md:grid-cols-2">
          <div>
            <Badge variant="secondary" className="mb-6 gap-1.5 rounded-full border-transparent bg-accent px-3.5 py-1.5 text-accent-foreground">
              <Sparkles className="h-3.5 w-3.5" />
              {c.hero.badge}
            </Badge>

            <h1 className="font-display text-4xl leading-[1.06] tracking-tight sm:text-5xl md:text-6xl">
              {c.hero.title}
              <span className="block text-primary">{c.hero.titleAccent}</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              {c.hero.sub}
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" className="h-12 px-7 text-base" onClick={() => router.push('/onboarding')}>
                {c.hero.cta}
                <ArrowRight className="ms-2 h-5 w-5 rtl:rotate-180" />
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-7 text-base" onClick={() => router.push('#features')}>
                {c.hero.cta2}
              </Button>
            </div>

            <p className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
              <Lock className="h-3.5 w-3.5" />
              {c.hero.note}
            </p>
          </div>

          {/* ---- the promo stage: the animated mark, framed by growth rings ---- */}
          <div className="relative mx-auto flex aspect-square w-full max-w-[440px] items-center justify-center">
            {/* concentric "growth rings" — a tree's own geometry */}
            <div className="pointer-events-none absolute inset-[16%] rounded-full border border-primary/15" aria-hidden />
            <div className="pointer-events-none absolute inset-[8%] rounded-full border border-primary/10" aria-hidden />
            <div className="pointer-events-none absolute inset-0 rounded-full border border-primary/[0.07]" aria-hidden />
            <div className="pointer-events-none absolute inset-[-9%] rounded-full border border-dashed border-accent" aria-hidden />
            <div className="pointer-events-none absolute inset-[-18%] rounded-full border border-dashed border-accent/50" aria-hidden />
            <div
              className="pointer-events-none absolute inset-[6%] rounded-full blur-2xl"
              style={{ background: 'radial-gradient(closest-side, color-mix(in oklab, var(--accent) 70%, transparent), transparent 74%)' }}
              aria-hidden
            />

            {/* the mark itself */}
            <div className="relative aspect-square w-[66%] overflow-hidden rounded-[26px] bg-card shadow-2xl shadow-primary/10 ring-1 ring-border">
              <LogoVideo
                className="h-full w-full object-cover"
                loop
                ariaLabel={ar ? 'شعار رحلة التعافي المتحرك' : 'Animated Recovery Journey logo'}
              />
            </div>

            {/* floating status chips */}
            <div className="absolute left-[-3%] top-[11%] flex items-center gap-2 rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-semibold shadow-lg">
              <span className="text-base leading-none">🌱</span>
              {ar ? 'اليوم ٤٧' : 'Day 47'}
            </div>
            <div className="absolute bottom-[15%] right-[-4%] flex items-center gap-2 rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-semibold shadow-lg">
              {ar ? 'الخطوة ٤ · الجرد' : 'Step 4 · Inventory'}
            </div>
            <div className="absolute bottom-[34%] left-[-7%] flex items-center gap-2 rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-semibold shadow-lg">
              {ar ? 'مدرب ٢٤/٧' : '24/7 coach'}
            </div>

            <div className="wordmark absolute -bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs text-foreground">
              RECOVERY JOURNEY
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- stats ---------------- */}
      <section className="border-y border-border/60 bg-muted/30">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-10 md:grid-cols-4">
          {c.stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-3xl font-bold text-transparent">
                {s.value}
              </div>
              <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- features ---------------- */}
      <section id="features" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{c.features.title}</h2>
          <p className="mt-3 text-lg text-muted-foreground">{c.features.sub}</p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {c.items.map((f) => (
            <Card
              key={f.en}
              className="group border-border/60 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
            >
              <CardContent className="p-6">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent-foreground transition-transform duration-300 group-hover:scale-110">
                  <f.icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold">{ar ? f.ar : f.en}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {ar ? f.dAr : f.dEn}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ---------------- 12 steps ---------------- */}
      <section id="steps" className="scroll-mt-20 border-y border-border/60 bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{c.steps.title}</h2>
            <p className="mt-3 text-lg text-muted-foreground">{c.steps.sub}</p>
          </div>

          <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {stepList.map((s, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-xl border border-border/60 bg-card p-4 transition-colors hover:border-primary/40"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary dark:text-primary">
                  {i + 1}
                </div>
                <p className="pt-1 text-sm leading-relaxed">{s}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- testimonial ---------------- */}
      <section className="mx-auto max-w-3xl px-4 py-20">
        <figure className="rounded-2xl border border-border/60 bg-card p-8 text-center">
          <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent-foreground">
            <Heart className="h-6 w-6 text-white" />
          </div>
          <blockquote className="text-lg leading-relaxed text-foreground/90">
            “{c.testimonial.quote}”
          </blockquote>
          <figcaption className="mt-4 text-sm text-muted-foreground">{c.testimonial.author}</figcaption>
        </figure>
      </section>

      {/* ---------------- faq ---------------- */}
      <section id="faq" className="scroll-mt-20 border-t border-border/60 bg-muted/30">
        <div className="mx-auto max-w-3xl px-4 py-20">
          <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
            {ar ? 'أسئلة شائعة' : 'Questions people actually ask'}
          </h2>
          <div className="mt-10 space-y-3">
            {c.faq.map((f) => (
              <details
                key={f.q}
                className="group rounded-xl border border-border/60 bg-card px-5 py-4 open:shadow-md"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-start font-medium">
                  {f.q}
                  <span className="shrink-0 text-muted-foreground transition-transform group-open:rotate-45">
                    <span className="text-xl leading-none">+</span>
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- final cta ---------------- */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="relative overflow-hidden rounded-3xl bg-primary p-10 text-center md:p-16">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                'radial-gradient(closest-side, white 2px, transparent 70%)',
              backgroundSize: '26px 26px',
            }}
            aria-hidden
          />
          <div className="relative mx-auto max-w-2xl">
            <div className="mx-auto mb-6 w-24">
              {/* the mark is dark ink — it needs the light treatment to read on green */}
              <TreeLogoMark
                className="mx-auto h-20 w-20"
                ink="#FFFFFF"
                leaf="var(--accent)"
                title="Recovery Journey"
              />
            </div>
            <h2 className="font-display text-3xl text-primary-foreground sm:text-4xl">{c.cta.title}</h2>
            <p className="mt-3 text-lg text-primary-foreground/85">{c.cta.sub}</p>
            <Button
              size="lg"
              className="mt-8 h-12 bg-background px-8 text-base text-primary hover:bg-accent"
              onClick={() => router.push('/onboarding')}
            >
              {c.cta.button}
              <ArrowRight className="ms-2 h-5 w-5 rtl:rotate-180" />
            </Button>
            <p className="mt-4 flex items-center justify-center gap-2 text-sm text-primary-foreground/75">
              <Smartphone className="h-4 w-4" />
              {ar ? 'يعمل على الهاتف والكمبيوتر' : 'Works on phone and desktop'}
            </p>
          </div>
        </div>
      </section>

      {/* ---------------- footer ---------------- */}
      <footer className="border-t border-border/60">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-muted-foreground sm:flex-row">
          <TreeLogoMark className="h-8 w-8" animate={false} title="Recovery Journey" />
          <p className="text-center sm:text-end">{c.footer}</p>
          <p className="flex items-center gap-1.5">
            <Lock className="h-3.5 w-3.5" />
            {ar ? 'بياناتك على جهازك' : 'Your data stays on your device'}
          </p>
        </div>
      </footer>
    </div>
  )
}