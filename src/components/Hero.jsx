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
  }
}

function CountdownUnit({ value, label }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-3xl font-light tabular-nums text-ink sm:text-4xl md:text-5xl">{value}</span>
      <span className="mt-0.5 text-sm text-ink-soft">{label}</span>
    </div>
  )
}

export default function Hero() {
  const heroRef = useRef(null)
  const [isVisible, setIsVisible] = useState(true)
  const [timeLeft, setTimeLeft] = useState(getTimeLeft)

  useEffect(() => {
    const interval = setInterval(() => setTimeLeft(getTimeLeft()), 10000)
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
      className="relative isolate flex min-h-svh w-full flex-col items-center justify-center overflow-hidden px-5 pt-16 pb-10 text-center"
    >

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

        <div className="hero-in mt-6 flex items-start justify-center gap-7 sm:gap-10" aria-hidden="true">
          <CountdownUnit value={timeLeft.days} label="giorni" />
          <CountdownUnit value={String(timeLeft.hours).padStart(2, '0')} label="ore" />
          <CountdownUnit value={String(timeLeft.minutes).padStart(2, '0')} label="minuti" />
        </div>
        <p className="sr-only">Mancano {timeLeft.days} giorni al matrimonio.</p>

        <div className="hero-in mt-8 flex w-full flex-col items-center gap-2 sm:w-auto sm:flex-row sm:gap-7">
          <a href="#rsvp" onClick={(e) => go(e, '#rsvp')} className="btn-star w-full sm:w-auto">
            Conferma la presenza
          </a>
          <a href="#programma" onClick={(e) => go(e, '#programma')} className="btn-ghost">
            Programma e luogo
          </a>
        </div>
      </div>
    </section>
  )
}
