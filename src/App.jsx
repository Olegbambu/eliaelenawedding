import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Schedule from './components/Schedule'
import Rsvp from './components/Rsvp'
import Story from './components/Story'
import Faq from './components/Faq'
import Gifts from './components/Gifts'
import Footer from './components/Footer'
import ButterflyBackground from './components/ButterflyBackground'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const lenis = new Lenis({
      duration: 0.9,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })
    window.lenis = lenis
    lenis.on('scroll', ScrollTrigger.update)

    const updateRaf = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(updateRaf)
    gsap.ticker.lagSmoothing(0)

    // Quiet arrival for section content. It starts already visible (dimmed, not
    // hidden), so nothing disappears if a scroll trigger never fires.
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.reveal').forEach((element) => {
        gsap.from(element, {
          opacity: 0.4,
          y: 24,
          duration: 0.8,
          ease: 'expo.out',
          scrollTrigger: { trigger: element, start: 'top 88%', once: true },
        })
      })
    })

    return () => {
      ctx.revert()
      gsap.ticker.remove(updateRaf)
      lenis.destroy()
      delete window.lenis
    }
  }, [])

  return (
    <div className="sky-page relative isolate min-h-screen text-ink antialiased">
      <Navbar />
      <ButterflyBackground />
      <main className="relative z-10">
        <Hero />
        <Schedule />
        <Rsvp />
        <Story />
        <Faq />
        <Gifts />
      </main>
      <Footer />
    </div>
  )
}
