import gsap from 'gsap'

const BUTTONS = '.btn-star, .btn-ghost'
const SPARKLE_PATH = 'M0 -10 L2.2 -2.2 L10 0 L2.2 2.2 L0 10 L-2.2 2.2 L-10 0 L-2.2 -2.2 Z'
const BURST_COLORS = ['#ffe45e', '#fff3b0', '#fbfbff']

// Buttons throw sparkles on press and ping the deep sky. No pointer following:
// buttons stay where they are, so they read as calm and dependable.
export function setupButtonFx() {
  const onClick = (event) => {
    const button = event.target.closest?.(BUTTONS)
    if (!button || button.disabled) return
    let { clientX: x, clientY: y } = event
    if (event.detail === 0) {
      // Keyboard press: burst from the middle of the button.
      const rect = button.getBoundingClientRect()
      x = rect.left + rect.width / 2
      y = rect.top + rect.height / 2
    }
    sparkleBurst(x, y)
    window.dispatchEvent(new CustomEvent('sky:burst', { detail: { x, y } }))
  }

  document.addEventListener('click', onClick)
  return () => document.removeEventListener('click', onClick)
}

let burstLayer = null

function sparkleBurst(x, y) {
  if (!burstLayer) {
    burstLayer = document.createElement('div')
    burstLayer.className = 'sparkle-burst'
    burstLayer.setAttribute('aria-hidden', 'true')
    document.body.append(burstLayer)
  }
  const count = 11
  for (let i = 0; i < count; i++) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.setAttribute('viewBox', '-10 -10 20 20')
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    path.setAttribute('d', SPARKLE_PATH)
    path.setAttribute('fill', BURST_COLORS[i % BURST_COLORS.length])
    svg.append(path)
    const size = 7 + Math.random() * 9
    svg.style.cssText = `left:${x - size / 2}px;top:${y - size / 2}px;width:${size}px;height:${size}px`
    burstLayer.append(svg)

    // Fan out upward, toward the sky, then drift and fade.
    const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.5
    const distance = 46 + Math.random() * 70
    const dx = Math.cos(angle) * distance
    const dy = Math.sin(angle) * distance
    const spin = (Math.random() - 0.5) * 220
    const animation = svg.animate(
      [
        { transform: 'translate(0, 0) scale(0) rotate(0deg)', opacity: 1 },
        { transform: `translate(${dx * 0.7}px, ${dy * 0.7}px) scale(1.15) rotate(${spin * 0.6}deg)`, opacity: 1, offset: 0.35 },
        { transform: `translate(${dx}px, ${dy - 34}px) scale(0.2) rotate(${spin}deg)`, opacity: 0 },
      ],
      { duration: 820 + Math.random() * 380, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'forwards' }
    )
    animation.onfinish = () => svg.remove()
  }
}

// Script headings write themselves left to right, a sparkle riding the pen tip.
export function setupHandwrittenHeadings() {
  const tweens = []
  for (const heading of document.querySelectorAll('main h2')) {
    const range = document.createRange()
    range.selectNodeContents(heading)
    const text = range.getBoundingClientRect()
    const box = heading.getBoundingClientRect()
    if (!text.width) continue

    const left = text.left - box.left
    const right = box.right - text.right
    const pad = 24
    const nib = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    nib.setAttribute('viewBox', '-10 -10 20 20')
    nib.setAttribute('aria-hidden', 'true')
    nib.classList.add('pen-nib')
    nib.innerHTML = `<path d="${SPARKLE_PATH}" fill="currentColor"/>`
    // The nib lives beside the heading, not in it, so the clip never cuts it.
    const host = heading.offsetParent ?? heading.parentElement
    host.append(nib)

    const timeline = gsap.timeline({
      scrollTrigger: { trigger: heading, start: 'top 86%', once: true },
      onStart: () => {
        const hostBox = host.getBoundingClientRect()
        const now = heading.getBoundingClientRect()
        nib.style.left = `${now.left - hostBox.left}px`
        nib.style.top = `${now.top - hostBox.top + now.height * 0.58}px`
      },
      onComplete: () => {
        heading.style.removeProperty('clip-path')
        nib.remove()
      },
    })
    timeline
      .fromTo(
        heading,
        { clipPath: `inset(-30% ${box.width - left + pad}px -30% ${left - pad}px)` },
        { clipPath: `inset(-30% ${right - pad}px -30% ${left - pad}px)`, duration: 1.5, ease: 'power2.inOut' }
      )
      .fromTo(
        nib,
        { x: left, opacity: 0, scale: 0.4 },
        { x: box.width - right, duration: 1.5, ease: 'power2.inOut', opacity: 1, scale: 1 },
        0
      )
      .to(nib, { opacity: 0, scale: 1.8, rotate: 90, duration: 0.5, ease: 'expo.out' })
    tweens.push({ timeline, heading, nib })
  }
  return () =>
    tweens.forEach(({ timeline, heading, nib }) => {
      timeline.scrollTrigger?.kill()
      timeline.kill()
      heading.style.removeProperty('clip-path')
      nib.remove()
    })
}
