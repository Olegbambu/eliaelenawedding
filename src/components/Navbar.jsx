import { useState, useEffect } from 'react'
import WeddingLogo from './WeddingLogo'

const links = [
  { name: 'Home', href: '#hero' },
  { name: 'La Storia', href: '#story' },
  { name: 'Dettagli', href: '#details' },
]

export default function Navbar() {
  const [activeSection, setActiveSection] = useState('#hero')

  useEffect(() => {
    const handleObserver = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(`#${entry.target.id}`)
        }
      })
    }

    const observer = new IntersectionObserver(handleObserver, { threshold: 0.4 })

    links.forEach((link) => {
      const element = document.querySelector(link.href)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [])

  const handleScrollTo = (e, href) => {
    e.preventDefault()
    setActiveSection(href)
    if (window.lenis) {
      window.lenis.scrollTo(href, { offset: -30, duration: 1.5 })
    } else {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-night-dark/90 backdrop-blur-md border-b border-star-yellow/20 py-4 px-6 shadow-lg">
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
                    >
                      <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
                    </svg>
                  </span>
                )}
              </a>
            )
          })}
        </div>

        <div className="hidden md:block">
          <a
            href="#rsvp"
            onClick={(e) => handleScrollTo(e, '#details')}
            className="text-2xs uppercase tracking-widest text-night-dark bg-star-yellow hover:bg-star-white px-4 py-2 rounded-full font-bold transition-all shadow-navbar-button cursor-pointer"
          >
            Conferma
          </a>
        </div>
      </div>
    </nav>
  )
}
