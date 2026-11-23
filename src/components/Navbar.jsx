import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import WeddingLogo from './WeddingLogo'

const NAVBAR_OFFSET = 90

// Document position without CSS transforms, so scroll animations
// in progress (GSAP y/scale) do not shift the scroll target.
const getLayoutTop = (element) => {
  let top = 0
  for (let node = element; node; node = node.offsetParent) top += node.offsetTop
  return top
}

const links = [
  { name: 'Home', href: '#hero' },
  { name: 'La Storia', href: '#story' },
  { name: 'Dettagli', href: '#details' },
  { name: 'Lista Nozze', href: '#gifts' },
]

export default function Navbar() {
  const [activeSection, setActiveSection] = useState('#hero')
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const handleObserver = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(`#${entry.target.id}`)
        }
      })
    }

    // A thin band around the middle of the viewport: works for sections of any height.
    const observer = new IntersectionObserver(handleObserver, {
      rootMargin: '-45% 0px -50% 0px',
    })

    links.forEach((link) => {
      const element = document.querySelector(link.href)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isMenuOpen) return
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setIsMenuOpen(false)
    }
    const handleResize = () => {
      if (window.matchMedia('(min-width: 768px)').matches) setIsMenuOpen(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('resize', handleResize)
    }
  }, [isMenuOpen])

  const handleScrollTo = (e, href) => {
    e.preventDefault()
    setActiveSection(href)
    setIsMenuOpen(false)
    const target = document.querySelector(href)
    if (!target) return
    const top = href === '#hero' ? 0 : Math.max(0, getLayoutTop(target) - NAVBAR_OFFSET)
    if (window.lenis) {
      window.lenis.scrollTo(top, { duration: 1.5 })
    } else {
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }

  return (
    <nav
      aria-label="Navigazione principale"
      className="fixed top-0 left-0 right-0 z-50 bg-night-dark/90 backdrop-blur-md border-b border-star-yellow/20 py-4 px-6 shadow-lg"
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between relative">
        <a
          href="#hero"
          onClick={(e) => handleScrollTo(e, '#hero')}
          className="text-3xl md:text-4xl text-star-yellow drop-shadow-navbar cursor-pointer"
        >
          <WeddingLogo />
        </a>

        <div className="hidden md:flex items-center space-x-6 text-xs uppercase tracking-navbar text-star-white absolute left-1/2 -translate-x-1/2">
          {links.map((link) => {
            const isActive = activeSection === link.href
            return (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleScrollTo(e, link.href)}
                aria-current={isActive ? 'location' : undefined}
                className={`relative py-1 transition-colors font-semibold cursor-pointer whitespace-nowrap ${
                  isActive ? 'text-star-yellow drop-shadow-navbar-active' : 'hover:text-star-yellow/80'
                }`}
              >
                {link.name}
                {isActive && (
                  <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center justify-center text-star-yellow animate-pulse transition-all duration-300">
                    <svg
                      className="w-3 h-3 drop-shadow-navbar-indicator"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
                    </svg>
                  </span>
                )}
              </a>
            )
          })}
        </div>

        <div className="flex items-center gap-2">
          <a
            href="#rsvp"
            onClick={(e) => handleScrollTo(e, '#rsvp')}
            className="text-2xs uppercase tracking-widest text-night-dark bg-star-yellow hover:bg-star-white px-4 py-3 md:py-2 rounded-full font-bold transition-all shadow-navbar-button cursor-pointer"
          >
            Conferma
          </a>
          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMenuOpen ? 'Chiudi menu' : 'Apri menu'}
            className="md:hidden flex size-11 items-center justify-center rounded-full text-star-yellow hover:bg-star-white/10 cursor-pointer"
          >
            {isMenuOpen ? <X className="size-6" aria-hidden="true" /> : <Menu className="size-6" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <ul id="mobile-menu" className="md:hidden mt-4 flex flex-col border-t border-star-yellow/20 pt-2">
          {links.map((link) => {
            const isActive = activeSection === link.href
            return (
              <li key={link.name}>
                <a
                  href={link.href}
                  onClick={(e) => handleScrollTo(e, link.href)}
                  aria-current={isActive ? 'location' : undefined}
                  className={`block py-3 text-sm uppercase tracking-navbar font-semibold ${
                    isActive ? 'text-star-yellow' : 'text-star-white'
                  }`}
                >
                  {link.name}
                </a>
              </li>
            )
          })}
        </ul>
      )}
    </nav>
  )
}
