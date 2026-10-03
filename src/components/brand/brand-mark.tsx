import { cn } from "@/lib/utils"

/**
 * BrandMark — the Recovery Journey logo.
 *
 * Renders a self-contained animated mark: rounded-square emerald→teal gradient
 * badge, a white heart whose outline draws itself on first paint, a breathing
 * "journey" stem, and orbiting sparkles + signal rings.
 *
 * Pure CSS keyframes, so it costs no JS and respects prefers-reduced-motion.
 */
export function BrandMark({
  className,
  animate = true,
  title,
}: {
  className?: string
  animate?: boolean
  title?: string
}) {
  const uid = animate ? "bm" : "bm-s"
  return (
    <svg
      viewBox="0 0 64 64"
      role={title ? "img" : "presentation"}
      aria-label={title}
      className={cn("overflow-visible", className)}
    >
      <defs>
        <linearGradient id={`${uid}-g`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#0d9488" />
        </linearGradient>
        <linearGradient id={`${uid}-sheen`} x1="0%" y1="0%" x2="60%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
          <stop offset="55%" stopColor="#ffffff" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* soft shadow */}
      <rect
        x="6" y="8.5" width="52" height="52" rx="13"
        fill="#022c22" opacity="0.35"
        className={animate ? "bm-shadow" : undefined}
      />

      {/* badge */}
      <rect width="64" height="64" rx="14" fill={`url(#${uid}-g)`} />

      {/* gradient sheen sweep */}
      <rect width="64" height="64" rx="14" fill={`url(#${uid}-sheen)`}>
        <animate
          attributeName="x"
          values="-64;-64;0;0;64"
          keyTimes="0;0.25;0.5;0.75;1"
          dur="6s"
          repeatCount="indefinite"
        />
      </rect>

      {/* signal rings */}
      <g className={animate ? "bm-rings" : undefined}>
        <circle cx="32" cy="32" r="26" fill="none" stroke="#fff" strokeWidth="0.9" opacity="0" />
        <circle cx="32" cy="32" r="26" fill="none" stroke="#fff" strokeWidth="0.9" opacity="0" />
      </g>

      {/* heart outline (draws itself) */}
      <path
        d="M32 25.6c-1.9-2.4-5.7-4-9.6-4-6.1 0-11 5.4-11 12.3 0 9.1 7.7 14 18.7 20.1 1.4.8 2.4 1.4 1.9 1.4"
        fill="none"
        stroke="#fff"
        strokeWidth="3.1"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={animate ? "bm-draw" : undefined}
        pathLength={100}
      />

      {/* heart body fill, fades in after the outline is drawn */}
      <path
        d="M32 25.6c-1.9-2.4-5.7-4-9.6-4-6.1 0-11 5.4-11 12.3 0 9.1 7.7 14 18.7 20.1 1.4.8 2.4 1.4 1.9 1.4"
        fill="#fff"
        fillOpacity="0.16"
        className={animate ? "bm-fill" : undefined}
      />

      {/* stem — the "journey" line */}
      <path
        d="M32 30.5 C32 38 32 44 32 53"
        fill="none"
        stroke="#fff"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.75"
        className={animate ? "bm-stem" : undefined}
      />

      {/* orbiting sparkle */}
      <g className={animate ? "bm-spin" : undefined}>
        <circle cx="32" cy="6.5" r="1.6" fill="#fff" opacity="0.9" />
        <circle cx="57.5" cy="32" r="1.1" fill="#fff" opacity="0.55" />
        <circle cx="32" cy="57.5" r="1.3" fill="#fff" opacity="0.7" />
      </g>

      <style>{`
        @keyframes bmDraw { to { stroke-dashoffset: 0 } }
        @keyframes bmFillIn { from { fill-opacity: 0 } to { fill-opacity: .16 } }
        @keyframes bmStem { 0%,100% { opacity:.35 } 50% { opacity:.9 } }
        @keyframes bmRing {
          0%   { transform: scale(.86); opacity: 0 }
          25%  { opacity: .55 }
          100% { transform: scale(1.35); opacity: 0 }
        }
        @keyframes bmSpin { to { transform: rotate(360deg) } }
        @keyframes bmShadow { 0%,100% { opacity:.22 } 50% { opacity:.42 } }
        @keyframes bmSheen { 0%,100% { transform: translateX(0) } 50% { transform: translateX(10px) } }

        .bm-draw   { stroke-dasharray: 100; stroke-dashoffset: 100; animation: bmDraw 1.15s cubic-bezier(.65,0,.35,1) .15s forwards }
        .bm-fill   { fill-opacity: 0; animation: bmFillIn .7s ease-out 1.05s forwards }
        .bm-stem   { animation: bmStem 3.2s ease-in-out 1.6s infinite }
        .bm-shadow { animation: bmShadow 3.2s ease-in-out 1.6s infinite }
        .bm-spin   { transform-origin: 32px 32px; animation: bmSpin 14s linear infinite }

        .bm-rings circle { transform-origin: 32px 32px; }
        .bm-rings circle:nth-child(1) { animation: bmRing 3.6s ease-out 1.6s infinite }
        .bm-rings circle:nth-child(2) { animation: bmRing 3.6s ease-out 3.4s infinite }

        @media (prefers-reduced-motion: reduce) {
          .bm-draw { animation: bmDraw .01s forwards }
          .bm-fill { animation: none; fill-opacity: .16 }
          .bm-stem, .bm-shadow, .bm-spin, .bm-rings circle { animation: none }
        }
      `}</style>
    </svg>
  )
}

/** BrandMark with the product wordmark beside it — for headers and hero slots. */
export function BrandLockup({
  className,
  animate = true,
  name = "Recovery Journey",
  nameAr = "رحلة التعافي",
  sub,
  subAr = "رفيق التعافي",
  language = "en",
}: {
  className?: string
  animate?: boolean
  name?: string
  nameAr?: string
  sub?: string
  subAr?: string
  language?: "en" | "ar"
}) {
  const ar = language === "ar"
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <BrandMark className="h-11 w-11 shrink-0" animate={animate} />
      <div className="leading-tight">
        <div
          className="text-lg font-bold tracking-tight sm:text-xl"
          dir={ar ? "rtl" : "ltr"}
        >
          {ar ? nameAr : name}
        </div>
        <div
          className="text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground"
          dir={ar ? "rtl" : "ltr"}
        >
          {ar ? subAr : sub}
        </div>
      </div>
    </div>
  )
}