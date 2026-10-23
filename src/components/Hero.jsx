import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import constellationDesktop from '../assets/constellation-desktop.png'
import constellationMobile from '../assets/constellation-mobile.png'

gsap.registerPlugin(ScrollTrigger)

export default function Hero() {
  const heroRef = useRef(null)
  const titleRef = useRef(null)
  const canvasRef = useRef(null)

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const targetDate = new Date('2027-05-14T00:00:00').getTime()

    const updateCountdown = () => {
      const now = new Date().getTime()
      const difference = targetDate - now

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        })
      }
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    let animationFrameId = null
    let shootingStarTimer = null
    let isVisible = false
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    const starCount = Math.floor((width * height) / 2500)
    const stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.5 + 0.5,
      alpha: Math.random(),
      alphaSpeed: (Math.random() * 0.02 + 0.005) * (Math.random() < 0.5 ? 1 : -1),
    }))

    const shootingStars = []
    const createShootingStar = () => {
      const startX = Math.random() * width * 1.2
      const startY = Math.random() * (height * 0.5)
      shootingStars.push({
        x: startX,
        y: startY,
        length: Math.random() * 90 + 50,
        speed: Math.random() * 12 + 8,
        size: Math.random() * 1.5 + 1,
        life: 0,
        maxLife: Math.random() * 40 + 30,
      })
    }

    const scheduleShootingStar = () => {
      if (!isVisible || shootingStarTimer !== null) return
      shootingStarTimer = setTimeout(() => {
        shootingStarTimer = null
        if (!isVisible) return
        createShootingStar()
        scheduleShootingStar()
      }, Math.random() * 2000 + 1500)
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height)

      stars.forEach((star) => {
        star.alpha += star.alphaSpeed
        if (star.alpha >= 1 || star.alpha <= 0.2) {
          star.alphaSpeed = -star.alphaSpeed
        }

        ctx.beginPath()
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(251, 251, 255, ${Math.abs(star.alpha)})`
        ctx.fill()
      })

      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const s = shootingStars[i]
        s.x -= s.speed
        s.y += s.speed * 0.6
        s.life++

        const progress = s.life / s.maxLife
        const currentAlpha = progress < 0.2 ? progress / 0.2 : 1 - (progress - 0.2) / 0.8

        const gradient = ctx.createLinearGradient(
          s.x,
          s.y,
          s.x + s.length * 0.8,
          s.y - s.length * 0.5
        )
        gradient.addColorStop(0, `rgba(253, 255, 3, ${Math.max(0, currentAlpha)})`)
        gradient.addColorStop(0.4, `rgba(251, 251, 255, ${Math.max(0, currentAlpha * 0.6)})`)
        gradient.addColorStop(1, 'rgba(251, 251, 255, 0)')

        ctx.beginPath()
        ctx.moveTo(s.x, s.y)
        ctx.lineTo(s.x + s.length * 0.8, s.y - s.length * 0.5)
        ctx.strokeStyle = gradient
        ctx.lineWidth = s.size
        ctx.lineCap = 'round'
        ctx.stroke()

        if (s.life >= s.maxLife) {
          shootingStars.splice(i, 1)
        }
      }

      if (isVisible) animationFrameId = requestAnimationFrame(render)
    }

    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting
      if (isVisible) {
        if (animationFrameId === null) animationFrameId = requestAnimationFrame(render)
        scheduleShootingStar()
      } else {
        if (animationFrameId !== null) cancelAnimationFrame(animationFrameId)
        animationFrameId = null
        if (shootingStarTimer !== null) clearTimeout(shootingStarTimer)
        shootingStarTimer = null
        shootingStars.length = 0
      }
    })
    observer.observe(heroRef.current)

    return () => {
      window.removeEventListener('resize', handleResize)
      observer.disconnect()
      if (animationFrameId !== null) cancelAnimationFrame(animationFrameId)
      if (shootingStarTimer !== null) clearTimeout(shootingStarTimer)
    }
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ['.bg-constellation-mobile', '.bg-constellation-desktop'],
        { opacity: 0.95 },
        { opacity: 0.5, duration: 2.5, ease: 'power2.out', delay: 0.3 }
      )

      gsap.from('.hero-anim', {
        y: 40,
        opacity: 0,
        duration: 2.2,
        stagger: 0.35,
        ease: 'power3.out',
        delay: 0.4,
      })

      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out', delay: 0.2 }
      )
    }, heroRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={heroRef}
      id="hero"
      className="min-h-dvh w-full bg-lalaland-hero flex flex-col items-center justify-center pt-24 pb-12 px-4 text-center relative overflow-hidden select-none"
    >
      <div className="absolute inset-0 z-0 h-dvh w-full pointer-events-none overflow-hidden md:hidden">
        <img
          src={constellationMobile}
          alt="Costellazione Mobile"
          className="bg-constellation-mobile w-full h-dvh object-cover object-center mix-blend-screen"
        />
      </div>

      <div className="absolute inset-0 z-0 h-dvh w-full hidden md:block pointer-events-none overflow-hidden">
        <img
          src={constellationDesktop}
          alt="Costellazione Desktop"
          className="bg-constellation-desktop w-full h-dvh object-cover object-center mix-blend-screen"
        />
      </div>

      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-dvh pointer-events-none z-10"
      />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-150 bg-star-yellow/10 rounded-full blur-hero-glow pointer-events-none z-10" />

      <div ref={titleRef} className="relative z-20 flex flex-col items-center max-w-4xl mx-auto w-full px-2">
        <span className="hero-anim text-2xs sm:text-xs md:text-sm uppercase tracking-hero text-star-yellow mb-3 md:mb-5 font-bold drop-shadow-hero-label">
          Salva la data
        </span>

        <h1 className="hero-anim text-5xl sm:text-7xl md:text-9xl text-star-white my-2 md:my-5 drop-shadow-hero-title whitespace-nowrap">
          Elia & Elena
        </h1>

        <div className="hero-anim mt-8 sm:mt-12 md:mt-16 flex flex-col items-center w-full">
          <p className="hero-anim font-serif italic text-2xl sm:text-3xl md:text-4xl text-star-white/90 mb-8 md:mb-10 drop-shadow-md">
            Ci sposiamo!
          </p>

          <p className="font-heading text-3xl sm:text-4xl md:text-6xl text-star-yellow drop-shadow-hero-date mb-6 md:mb-8">
            14 Maggio 2027
          </p>

          <div className="flex items-center justify-center space-x-3 sm:space-x-6 md:space-x-10 mt-1 w-full max-w-md">
            <div className="flex flex-col items-center">
              <span className="font-heading text-3xl sm:text-4xl md:text-6xl text-star-white drop-shadow-md">
                {timeLeft.days}
              </span>
              <span className="text-3xs sm:text-2xs md:text-xs uppercase tracking-widest text-star-yellow/80 mt-1 sm:mt-2 font-bold">
                Giorni
              </span>
            </div>

            <span className="font-heading text-3xl sm:text-4xl md:text-6xl text-star-yellow/60 -mt-4 sm:-mt-6">:</span>

            <div className="flex flex-col items-center">
              <span className="font-heading text-3xl sm:text-4xl md:text-6xl text-star-white drop-shadow-md">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span className="text-3xs sm:text-2xs md:text-xs uppercase tracking-widest text-star-yellow/80 mt-1 sm:mt-2 font-bold">
                Ore
              </span>
            </div>

            <span className="font-heading text-3xl sm:text-4xl md:text-6xl text-star-yellow/60 -mt-4 sm:-mt-6">:</span>

            <div className="flex flex-col items-center">
              <span className="font-heading text-3xl sm:text-4xl md:text-6xl text-star-white drop-shadow-md">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span className="text-3xs sm:text-2xs md:text-xs uppercase tracking-widest text-star-yellow/80 mt-1 sm:mt-2 font-bold">
                Minuti
              </span>
            </div>

            <span className="font-heading text-3xl sm:text-4xl md:text-6xl text-star-yellow/60 -mt-4 sm:-mt-6">:</span>

            <div className="flex flex-col items-center">
              <span className="font-heading text-3xl sm:text-4xl md:text-6xl text-star-white drop-shadow-md">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
              <span className="text-3xs sm:text-2xs md:text-xs uppercase tracking-widest text-star-yellow/80 mt-1 sm:mt-2 font-bold">
                Secondi
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}