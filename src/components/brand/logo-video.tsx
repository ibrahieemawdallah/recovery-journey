"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

type Props = {
  src?: string
  webm?: string
  poster?: string
  className?: string
  /** Pause the loop when scrolled out of view / tab hidden — keeps CPU flat. */
  autoPause?: boolean
  ariaLabel?: string
  loop?: boolean
}

/**
 * LogoVideo — plays the generated brand loop (MP4 with WebM fallback).
 *
 * The <video> is decorative: the accessible name comes from aria-label and the
 * mark itself is exposed as text, so nothing is lost when it can't play
 * (reduced motion, blocked codec, autoplay policy) — the poster frame shows.
 */
export function LogoVideo({
  src = "/logo-anim.mp4",
  webm = "/logo-anim.webm",
  poster = "/logo-poster.png",
  className,
  autoPause = true,
  ariaLabel = "Animated Recovery Journey logo",
  loop = false,
}: Props) {
  const ref = useRef<HTMLVideoElement | null>(null)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    const apply = () => setReduced(mq.matches)
    apply()
    mq.addEventListener("change", apply)
    return () => mq.removeEventListener("change", apply)
  }, [])

  useEffect(() => {
    if (!autoPause) return
    const v = ref.current
    if (!v) return

    const play = () => {
      if (document.hidden) return
      v.play().catch(() => {})
    }
    const onVis = () => (document.hidden ? v.pause() : play())
    const onIntersect = (e: IntersectionObserverEntry[]) => {
      const vis = e[0]?.isIntersecting ?? true
      if (vis && !document.hidden) play()
      else v.pause()
    }

    document.addEventListener("visibilitychange", onVis)
    let io: IntersectionObserver | undefined
    if (typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver(onIntersect, { threshold: 0.15 })
      io.observe(v)
    }
    return () => {
      document.removeEventListener("visibilitychange", onVis)
      io?.disconnect()
    }
  }, [autoPause])

  return (
    <video
      ref={ref}
      className={cn("h-auto w-full", className)}
      poster={poster}
      autoPlay={!reduced}
      loop={loop}
      muted
      playsInline
      preload="metadata"
      aria-label={ariaLabel}
      role="img"
    >
      {webm && <source src={webm} type="video/webm" />}
      {src && <source src={src} type="video/mp4" />}
    </video>
  )
}