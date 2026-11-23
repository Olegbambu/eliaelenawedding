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
        solid ? 'border-b border-star/15 bg-night-950/92 backdrop-blur-md' : 'border-b border-transparent bg-transparent'
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
                  className={`relative py-2 text-sm font-bold transition-colors ${
                    isActive ? 'text-star' : 'text-ink-soft hover:text-ink'
                  }`}
                >
                  {link.name}
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
          className="flex size-12 items-center justify-center rounded-full text-star hover:bg-ink/10 md:hidden cursor-pointer"
        >
          {isMenuOpen ? <X className="size-6" aria-hidden="true" /> : <Menu className="size-6" aria-hidden="true" />}
        </button>
      </div>

      {isMenuOpen && (
        <ul id="mobile-menu" className="mx-auto max-w-6xl border-t border-star/15 pt-2 pb-4 md:hidden">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={(e) => go(e, link.href)}
                aria-current={activeSection === link.href ? 'location' : undefined}
                className={`block py-3 text-lg font-bold ${activeSection === link.href ? 'text-star' : 'text-ink'}`}
              >
                {link.name}
              </a>
            </li>
          ))}
        </ul>
      )}
    </nav>
  )
}
