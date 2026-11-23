import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import Constellation from './Constellation'
import { wedding } from '../content'
import { scrollToSection } from '../lib/scrollTo'

const TARGET = new Date(wedding.dateISO).getTime()

function getTimeLeft() {
  const difference = Math.max(0, TARGET - Date.now())
  return {
    days: Math.floor(difference / 86400000),
    hours: Math.floor((difference % 86400000) / 3600000),
    minutes: Math.floor((difference % 3600000) / 60000),
    seconds: Math.floor((difference % 60000) / 1000),
  }
}

function useStarfield(canvasRef, isVisible) {
  const visibleRef = useRef(isVisible)

  useEffect(() => {
    visibleRef.current = isVisible
  }, [isVisible])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let width = 0
    let height = 0
    let stars = []
    let shootingStars = []
    let frame = null
    let lastShootingStar = 0

    const resize = () => {
      width = canvas.clientWidth
      height = canvas.clientHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      stars = Array.from({ length: Math.floor((width * height) / 3200) }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.2 + 0.4,
        alpha: Math.random() * 0.8 + 0.2,
        speed: (Math.random() * 0.012 + 0.003) * (Math.random() < 0.5 ? 1 : -1),
      }))
    }

    const draw = (time) => {
      ctx.clearRect(0, 0, width, height)
      for (const star of stars) {
        if (!reduceMotion) {
          star.alpha += star.speed
          if (star.alpha >= 1 || star.alpha <= 0.2) star.speed = -star.speed
        }
        ctx.globalAlpha = star.alpha
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
        ctx.fillStyle = '#fbfbff'
        ctx.fill()
      }
      ctx.globalAlpha = 1

      if (!reduceMotion && time - lastShootingStar > 3200 + Math.random() * 2500) {
        lastShootingStar = time
        shootingStars.push({
          x: Math.random() * width * 1.1,
          y: Math.random() * height * 0.4,
          length: Math.random() * 80 + 60,
          speed: Math.random() * 8 + 9,
          life: 0,
          maxLife: 45,
        })
      }

      shootingStars = shootingStars.filter((s) => s.life < s.maxLife)
      for (const s of shootingStars) {
        s.x -= s.speed
        s.y += s.speed * 0.6
        s.life++
        const progress = s.life / s.maxLife
        const alpha = progress < 0.2 ? progress / 0.2 : 1 - (progress - 0.2) / 0.8
        const gradient = ctx.createLinearGradient(s.x, s.y, s.x + s.length * 0.8, s.y - s.length * 0.5)
        gradient.addColorStop(0, `rgba(255, 228, 94, ${alpha})`)
        gradient.addColorStop(1, 'rgba(251, 251, 255, 0)')
        ctx.beginPath()
        ctx.moveTo(s.x, s.y)
        ctx.lineTo(s.x + s.length * 0.8, s.y - s.length * 0.5)
        ctx.strokeStyle = gradient
        ctx.lineWidth = 1.5
        ctx.lineCap = 'round'
        ctx.stroke()
      }

      frame = visibleRef.current && !reduceMotion ? requestAnimationFrame(draw) : null
    }

    resize()
    draw(0)
    window.addEventListener('resize', resize)

    const resume = () => {
      if (frame === null && visibleRef.current && !reduceMotion) frame = requestAnimationFrame(draw)
    }
    const interval = setInterval(resume, 500)

    return () => {
      window.removeEventListener('resize', resize)
      clearInterval(interval)
      if (frame !== null) cancelAnimationFrame(frame)
    }
  }, [canvasRef])
}

function CountdownUnit({ value, label }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-3xl font-light tabular-nums text-ink sm:text-4xl md:text-5xl">{value}</span>
      <span className="mt-1 text-xs font-bold uppercase tracking-widest text-star/90">{label}</span>
    </div>
  )
}

export default function Hero() {
  const heroRef = useRef(null)
  const canvasRef = useRef(null)
  const [isVisible, setIsVisible] = useState(true)
  const [timeLeft, setTimeLeft] = useState(getTimeLeft)

  useStarfield(canvasRef, isVisible)

  useEffect(() => {
    const interval = setInterval(() => setTimeLeft(getTimeLeft()), 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting))
    observer.observe(heroRef.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      gsap.from('.hero-in', {
        opacity: 0,
        y: 18,
        filter: 'blur(8px)',
        duration: 1.1,
        ease: 'expo.out',
        stagger: 0.12,
        delay: 0.35,
        clearProps: 'filter',
      })
    }, heroRef)
    return () => ctx.revert()
  }, [])

  const go = (event, href) => {
    event.preventDefault()
    scrollToSection(href)
  }

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative isolate flex min-h-svh w-full flex-col items-center justify-center overflow-hidden bg-night-950 px-5 pt-16 pb-10 text-center"
    >
      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 -z-10 h-full w-full" aria-hidden="true" />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-linear-to-b from-transparent to-night-950"
        aria-hidden="true"
      />

      <div className="pointer-events-none relative h-[38svh] w-full max-w-md md:h-[42svh] md:max-w-2xl">
        <Constellation isVisible={isVisible} />
      </div>

      <div className="relative z-10 -mt-2 flex w-full max-w-3xl flex-col items-center">
        <h1 className="hero-in text-6xl text-ink drop-shadow-[0_4px_24px_rgb(8_2_29_/_90%)] sm:text-7xl md:text-8xl">
          {wedding.couple}
        </h1>
        <p className="hero-in mt-3 text-lg text-ink-soft md:text-xl">
          Ci sposiamo il{' '}
          <span className="font-bold text-star">{wedding.dateLabel}</span>
          <br className="sm:hidden" />
          <span className="hidden sm:inline"> · </span>
          Trebaseleghe (PD)
        </p>

        <div className="hero-in mt-6 flex items-start justify-center gap-5 sm:gap-8" aria-hidden="true">
          <CountdownUnit value={timeLeft.days} label="Giorni" />
          <CountdownUnit value={String(timeLeft.hours).padStart(2, '0')} label="Ore" />
          <CountdownUnit value={String(timeLeft.minutes).padStart(2, '0')} label="Minuti" />
          <CountdownUnit value={String(timeLeft.seconds).padStart(2, '0')} label="Secondi" />
        </div>
        <p className="sr-only">Mancano {timeLeft.days} giorni al matrimonio.</p>

        <div className="hero-in mt-8 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row">
          <a href="#rsvp" onClick={(e) => go(e, '#rsvp')} className="btn-star w-full sm:w-auto">
            Conferma la presenza
          </a>
          <a href="#programma" onClick={(e) => go(e, '#programma')} className="btn-ghost w-full sm:w-auto">
            Programma e luogo
          </a>
        </div>
      </div>
    </section>
  )
}
