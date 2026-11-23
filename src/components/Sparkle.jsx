// The world's four-point star, shared by the hero constellation, timeline and nav.
export default function Sparkle({ className = '' }) {
  return (
    <svg viewBox="-10 -10 20 20" className={className} aria-hidden="true">
      <path d="M0 -10 L2.2 -2.2 L10 0 L2.2 2.2 L0 10 L-2.2 2.2 L-10 0 L-2.2 -2.2 Z" fill="currentColor" />
    </svg>
  )
}
