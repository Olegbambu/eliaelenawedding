import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Story from './components/Story'
import Details from './components/Details'
import Footer from './components/Footer'
import ButterflyBackground from './components/ButterflyBackground'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    window.lenis = lenis
    lenis.on('scroll', ScrollTrigger.update)

    const updateRaf = (time) => {
      lenis.raf(time * 1000)
    }

    gsap.ticker.add(updateRaf)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(updateRaf)
      lenis.destroy()
      delete window.lenis
    }
  }, [])

  return (
    <div className="relative isolate min-h-screen text-star-white antialiased selection:bg-star-yellow selection:text-night-dark">
      <Navbar />
      <ButterflyBackground />
      <main className="relative z-10">
        <Hero />
        <Story />
        <div className="bg-lalaland-sunset">
          <Details />
        </div>
      </main>
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  )
}
