// Now and then a single shooting star crosses a random part of the sky.
// Drawn on its own small 2D canvas, which is only painted while a streak is alive.
export function startShootingStars(canvas) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return () => {}
  let width = 0
  let height = 0
  let frame = null
  let timer = null
  let stopped = false

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    width = window.innerWidth
    height = window.innerHeight
    canvas.width = width * dpr
    canvas.height = height * dpr
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }

  const onSunset = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight
    return max > 0 && window.scrollY / max > 0.86
  }

  const schedule = () => {
    if (stopped) return
    timer = window.setTimeout(launch, 6000 + Math.random() * 8000)
  }

  const launch = () => {
    if (document.hidden || onSunset()) return schedule()
    const small = width < 768
    const streak = {
      x: width * (0.25 + Math.random() * 0.85),
      y: height * Math.random() * 0.55,
      angle: Math.PI * (0.78 + Math.random() * 0.1), // down and to the left
      speed: (small ? 9 : 13) + Math.random() * 6,
      length: (small ? 90 : 150) + Math.random() * 90,
      life: 0,
      maxLife: 48,
    }
    const step = () => {
      ctx.clearRect(0, 0, width, height)
      streak.life++
      streak.x += Math.cos(streak.angle) * streak.speed
      streak.y += Math.sin(streak.angle) * streak.speed
      const progress = streak.life / streak.maxLife
      const alpha = progress < 0.15 ? progress / 0.15 : 1 - (progress - 0.15) / 0.85
      const tailX = streak.x - Math.cos(streak.angle) * streak.length
      const tailY = streak.y - Math.sin(streak.angle) * streak.length
      const gradient = ctx.createLinearGradient(streak.x, streak.y, tailX, tailY)
      gradient.addColorStop(0, `rgba(255, 243, 176, ${alpha})`)
      gradient.addColorStop(0.15, `rgba(255, 228, 94, ${alpha * 0.8})`)
      gradient.addColorStop(1, 'rgba(251, 251, 255, 0)')
      ctx.beginPath()
      ctx.moveTo(streak.x, streak.y)
      ctx.lineTo(tailX, tailY)
      ctx.strokeStyle = gradient
      ctx.lineWidth = 1.6
      ctx.lineCap = 'round'
      ctx.stroke()
      // A bright head with a soft glow.
      ctx.beginPath()
      ctx.arc(streak.x, streak.y, 1.8, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(255, 250, 220, ${alpha})`
      ctx.shadowColor = `rgba(255, 228, 94, ${alpha})`
      ctx.shadowBlur = 10
      ctx.fill()
      ctx.shadowBlur = 0

      if (streak.life < streak.maxLife && !stopped) {
        frame = requestAnimationFrame(step)
      } else {
        ctx.clearRect(0, 0, width, height)
        frame = null
        schedule()
      }
    }
    frame = requestAnimationFrame(step)
  }

  resize()
  window.addEventListener('resize', resize)
  // The first one comes a little sooner, so the hero gets one early.
  timer = window.setTimeout(launch, 2500 + Math.random() * 2500)

  return () => {
    stopped = true
    window.clearTimeout(timer)
    if (frame !== null) cancelAnimationFrame(frame)
    window.removeEventListener('resize', resize)
  }
}
