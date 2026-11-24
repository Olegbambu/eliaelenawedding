import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import WeddingLogo from './WeddingLogo'
import Sparkle from './Sparkle'
import { scrollToSection } from '../lib/scrollTo'

const links = [
  { name: 'Programma', href: '#programma' },
  { name: 'Conferma', href: '#rsvp' },
  { name: 'Storia', href: '#storia' },
  { name: 'Domande', href: '#faq' },
  { name: 'Lista nozze', href: '#regali' },
]

export default function Navbar() {
  const [activeSection, setActiveSection] = useState('#hero')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(`#${entry.target.id}`)
        })
      },
      { rootMargin: '-45% 0px -50% 0px' }
    )
    ;['#hero', ...links.map((link) => link.href)].forEach((href) => {
      const element = document.querySelector(href)
      if (element) observer.observe(element)
    })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!isMenuOpen) return
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setIsMenuOpen(false)
    }
    const onResize = () => {
      if (window.matchMedia('(min-width: 768px)').matches) setIsMenuOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('resize', onResize)
    }
  }, [isMenuOpen])

  const go = (event, href) => {
    event.preventDefault()
    setActiveSection(href)
    setIsMenuOpen(false)
    scrollToSection(href)
  }

  const solid = isScrolled || isMenuOpen

  return (
    <nav
      aria-label="Navigazione principale"
      className={`fixed inset-x-0 top-0 z-50 px-5 transition-[background-color,border-color] duration-300 ${
        solid ? 'border-b border-star/15 bg-night-950/96' : 'border-b border-transparent bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between">
        <a href="#hero" onClick={(e) => go(e, '#hero')} className="text-4xl text-star" aria-label="Torna all'inizio">
          <WeddingLogo />
        </a>

        <ul className="hidden items-center gap-7 md:flex">
          {links.map((link) => {
            const isActive = activeSection === link.href
            return (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={(e) => go(e, link.href)}
                  aria-current={isActive ? 'location' : undefined}
                  className={`group relative inline-block py-2 text-[0.9375rem] font-bold transition-colors duration-200 ${
                    isActive ? 'text-star' : 'text-ink-soft hover:text-ink focus-visible:text-ink'
                  }`}
                >
                  {link.name}
                  {/* Hover: a line drawn out from the centre under the hovered word. */}
                  {!isActive && (
                    <span
                      className="absolute inset-x-0 bottom-0.5 h-px origin-center scale-x-0 bg-ink transition-transform duration-300 ease-out-expo group-hover:scale-x-100 group-focus-visible:scale-x-100 motion-reduce:transition-none"
                      aria-hidden="true"
                    />
                  )}
                  <Sparkle
                    className={`absolute -bottom-2 left-1/2 size-2.5 -translate-x-1/2 text-star transition-[opacity,scale] duration-300 ease-out-expo ${
                      isActive ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
                    }`}
                  />
                </a>
              </li>
            )
          })}
        </ul>

        <button
          type="button"
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
          aria-label={isMenuOpen ? 'Chiudi menu' : 'Apri menu'}
          className="btn-icon -mr-3 text-star md:hidden"
        >
          {isMenuOpen ? <X className="size-6" aria-hidden="true" /> : <Menu className="size-6" aria-hidden="true" />}
        </button>
      </div>

      {isMenuOpen && (
        <ul id="mobile-menu" className="mx-auto max-w-6xl border-t border-star/15 pb-3 md:hidden">
          {links.map((link) => (
            <li key={link.href} className="border-b border-ink-soft/12 last:border-0">
              <a
                href={link.href}
                onClick={(e) => go(e, link.href)}
                aria-current={activeSection === link.href ? 'location' : undefined}
                className={`flex min-h-14 items-center gap-3 text-lg font-bold ${activeSection === link.href ? 'text-star' : 'text-ink'}`}
              >
                <Sparkle
                  className={`size-3 shrink-0 text-star ${activeSection === link.href ? 'opacity-100' : 'opacity-0'}`}
                />
                {link.name}
              </a>
            </li>
          ))}
        </ul>
      )}
    </nav>
  )
}
