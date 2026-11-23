import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import constellationArt from '../assets/constellation-desktop.png?format=webp&w=1366'

// Star centres measured from constellation-desktop.png (1366 × 768).
const KISS = { x: 698, y: 365 }
const STARS = [
  [700, 196, true], [572, 267], [839, 290, true], [711, 307], [648, 325], [813, 332],
  [698, 365, true], [895, 370], [530, 394, true], [622, 431], [873, 449], [457, 467],
  [673, 484, true], [903, 525, true], [602, 528], [838, 558], [435, 614, true], [699, 624],
  [630, 636], [749, 672, true],
]
  .map(([x, y, big = false]) => ({ x, y, big, distance: Math.hypot(x - KISS.x, y - KISS.y) }))
  .sort((a, b) => a.distance - b.distance)

const ART_VIEW = '390 140 600 580'
const REVEAL_RADIUS = 520

const sparkle = (size) =>
  `M0 ${-size} L${size * 0.22} ${-size * 0.22} L${size} 0 L${size * 0.22} ${size * 0.22} L0 ${size} L${-size * 0.22} ${size * 0.22} L${-size} 0 L${-size * 0.22} ${-size * 0.22} Z`

export default function Constellation({ isVisible }) {
  const svgRef = useRef(null)
  // Signature moment: the stars light up one by one, starting from the kiss,
  // then the drawing is revealed outward from the same point.
  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const ctx = gsap.context(() => {
      const stars = gsap.utils.toArray('.constellation-star')
      const reveal = svg.querySelector('.constellation-reveal')

      if (reduceMotion) {
        gsap.set(reveal, { attr: { r: REVEAL_RADIUS } })
        gsap.fromTo(svg, { opacity: 0 }, { opacity: 1, duration: 0.6 })
        svg.classList.add('is-lit')
        return
      }

      gsap.set(stars, { scale: 0, opacity: 0 })
      gsap.set(reveal, { attr: { r: 0 } })

      gsap
        .timeline({ delay: 0.25, onComplete: () => svg.classList.add('is-lit') })
        .to(stars, {
          keyframes: [
            { scale: 1.8, opacity: 1, duration: 0.22, ease: 'power2.out' },
            { scale: 1, duration: 0.5, ease: 'expo.out' },
          ],
          stagger: 0.075,
        })
        .to(reveal, { attr: { r: REVEAL_RADIUS }, duration: 2.2, ease: 'expo.out' }, 0.35)
    }, svg)

    return () => ctx.revert()
  }, [])

  return (
    <svg
      ref={svgRef}
      viewBox={ART_VIEW}
      preserveAspectRatio="xMidYMid meet"
      className={`constellation h-full w-full ${isVisible ? '' : 'is-paused'}`}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="star-halo">
          <stop offset="0%" stopColor="#fff6c2" stopOpacity="0.95" />
          <stop offset="35%" stopColor="#ffe45e" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#ffe45e" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="reveal-fade">
          <stop offset="62%" stopColor="#fff" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        {/* Turns the PNG's dark backdrop transparent, keeping only the drawn lines. */}
        <filter id="lines-only" colorInterpolationFilters="sRGB">
          <feColorMatrix
            type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  1.3 1.3 0.2 0 -0.32"
          />
        </filter>
        <mask id="constellation-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="1366" height="768">
          <circle className="constellation-reveal" cx={KISS.x} cy={KISS.y} r={REVEAL_RADIUS} fill="url(#reveal-fade)" />
        </mask>
      </defs>

      <image
        href={constellationArt}
        width="1366"
        height="768"
        mask="url(#constellation-mask)"
        filter="url(#lines-only)"
        opacity="0.9"
      />

      {STARS.map((star) => (
        <g key={`${star.x}-${star.y}`} transform={`translate(${star.x} ${star.y})`}>
          <g className={`constellation-star ${star.big ? 'constellation-star--big' : ''}`}>
            <circle className="constellation-star__halo" r={star.big ? 26 : 16} />
            <path d={sparkle(star.big ? 9 : 6)} fill="#fff8d6" />
          </g>
        </g>
      ))}
    </svg>
  )
}
