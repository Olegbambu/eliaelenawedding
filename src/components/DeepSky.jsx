import { useEffect, useRef } from 'react'
import { startShootingStars } from '../lib/shootingStars'

// A still sky for devices that skip WebGL: a few hundred dots drawn once in 2D.
function drawStillSky(canvas) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  const width = window.innerWidth
  const height = window.innerHeight
  canvas.width = width * dpr
  canvas.height = height * dpr
  ctx.scale(dpr, dpr)
  const count = Math.floor((width * height) / 3600)
  for (let i = 0; i < count; i++) {
    ctx.globalAlpha = 0.25 + Math.random() * 0.65
    ctx.fillStyle = Math.random() < 0.12 ? '#ffe45e' : '#fbfbff'
    ctx.beginPath()
    ctx.arc(Math.random() * width, Math.random() * height, Math.random() * 1.1 + 0.4, 0, Math.PI * 2)
    ctx.fill()
  }
  canvas.classList.add('is-ready')
}

// Mounts the WebGL deep sky as soon as the first paint is done. It is the night sky
// of the whole page, hero included. Weak devices, Save-Data or no WebGL get a still sky.
export default function DeepSky() {
  const canvasRef = useRef(null)
  const streakRef = useRef(null)

  useEffect(() => {
    if (!streakRef.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    return startShootingStars(streakRef.current)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    const connection = navigator.connection
    const weak =
      connection?.saveData ||
      (navigator.deviceMemory && navigator.deviceMemory <= 2) ||
      (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2)
    if (!canvas) return
    if (weak) {
      drawStillSky(canvas)
      return
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let sky = null
    let frame = null
    let disposed = false
    const listeners = []
    const on = (target, type, handler, options) => {
      target.addEventListener(type, handler, options)
      listeners.push(() => target.removeEventListener(type, handler, options))
    }

    const loop = (now) => {
      sky.render(now)
      frame = document.hidden ? null : requestAnimationFrame(loop)
    }

    const start = async () => {
      const { createDeepSky } = await import('../lib/deepSkyScene')
      if (disposed) return
      sky = createDeepSky(canvas, { animate: !reduceMotion })
      if (!sky) {
        drawStillSky(canvas)
        return
      }
      sky.resize()
      canvas.classList.add('is-ready')

      if (reduceMotion) {
        // A still sky: redraw only when the page moves, nothing animates on its own.
        const draw = () => sky.render(performance.now())
        draw()
        on(window, 'resize', () => { sky.resize(); draw() })
        on(window, 'scroll', draw, { passive: true })
        return
      }

      on(window, 'resize', () => sky.resize())
      on(window, 'pointermove', (event) => {
        if (event.pointerType !== 'mouse') return
        sky.setPointer((event.clientX / window.innerWidth) * 2 - 1, 1 - (event.clientY / window.innerHeight) * 2)
      }, { passive: true })
      on(window, 'sky:burst', (event) => sky.burst(event.detail.x, event.detail.y))
      on(document, 'visibilitychange', () => {
        if (!document.hidden && frame === null) frame = requestAnimationFrame(loop)
      })
      frame = requestAnimationFrame(loop)
    }

    const idle = window.requestIdleCallback
      ? window.requestIdleCallback(start, { timeout: 400 })
      : window.setTimeout(start, 200)

    return () => {
      disposed = true
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle)
      else window.clearTimeout(idle)
      if (frame !== null) cancelAnimationFrame(frame)
      listeners.forEach((off) => off())
      sky?.dispose()
    }
  }, [])

  return (
    <>
      <canvas ref={canvasRef} className="deep-sky" aria-hidden="true" />
      <canvas ref={streakRef} className="shooting-stars" aria-hidden="true" />
    </>
  )
}
