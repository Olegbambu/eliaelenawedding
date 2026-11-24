import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import DraftBadge from './DraftBadge'
import PhotoModal from './PhotoModal'
import Sparkle from './Sparkle'
import { story } from '../content'
import { getPhoto, photos } from '../lib/photos'

gsap.registerPlugin(ScrollTrigger)

const tilts = ['-rotate-2', 'rotate-2', '-rotate-1', 'rotate-1']

// Every photo in reading order: timeline photos first, then the strip.
const storyFiles = story.flatMap((item) => item.photos)
const stripPhotos = photos.filter((photo) => !storyFiles.includes(photo.file))
const gallery = [...storyFiles.map(getPhoto).filter(Boolean), ...stripPhotos].map((photo, index) => ({
  ...photo,
  alt: `Elia ed Elena, foto ${index + 1}`,
}))
const galleryIndex = new Map(gallery.map((photo, index) => [photo.file, index]))

// Mouse only: the print tips toward the pointer, the gloss and shadow follow it.
function tiltToward(event) {
  if (event.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const button = event.currentTarget
  const rect = button.getBoundingClientRect()
  const x = (event.clientX - rect.left) / rect.width - 0.5
  const y = (event.clientY - rect.top) / rect.height - 0.5
  button.classList.add('is-tilting')
  button.style.setProperty('--rx', `${(-y * 18).toFixed(2)}deg`)
  button.style.setProperty('--ry', `${(x * 18).toFixed(2)}deg`)
  button.style.setProperty('--gx', `${((x + 0.5) * 100).toFixed(1)}%`)
  button.style.setProperty('--gy', `${((y + 0.5) * 100).toFixed(1)}%`)
  button.style.setProperty('--sx', (-x * 24).toFixed(1))
  button.style.setProperty('--sy', (-y * 16).toFixed(1))
}

function settle(event) {
  const button = event.currentTarget
  button.classList.remove('is-tilting')
  for (const name of ['--rx', '--ry', '--gx', '--gy', '--sx', '--sy']) button.style.removeProperty(name)
}

function Photo({ photo, tilt, onOpen }) {
  return (
    <button
      type="button"
      className="photo-button"
      onClick={(event) => onOpen(photo.file, event.currentTarget)}
      onPointerMove={tiltToward}
      onPointerLeave={settle}
    >
      <span className={`polaroid ${tilt}`}>
        <Sparkle className="polaroid__star" />
        <img
          srcSet={photo.srcSet}
          sizes="(min-width: 768px) 15rem, 60vw"
          src={photo.src}
          alt={photo.alt}
          loading="lazy"
          decoding="async"
        />
      </span>
      <span className="sr-only">Ingrandisci</span>
    </button>
  )
}

export default function Story() {
  const sectionRef = useRef(null)
  const lastTriggerRef = useRef(null)
  const stripRef = useRef(null)
  const [openIndex, setOpenIndex] = useState(null)

  const openPhoto = useCallback((file, trigger) => {
    lastTriggerRef.current = trigger
    setOpenIndex(galleryIndex.get(file) ?? 0)
  }, [])
  const closePhoto = useCallback(() => setOpenIndex(null), [])
  const scrollStrip = (direction) => {
    const strip = stripRef.current
    if (!strip) return
    const card = strip.firstElementChild
    const step = card ? card.getBoundingClientRect().width + 20 : strip.clientWidth * 0.8
    strip.scrollBy({ left: direction * step * 2, behavior: 'smooth' })
  }

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const ctx = gsap.context(() => {
      // The line between the stars draws itself as you read down the story.
      gsap.fromTo(
        '.story-line',
        { scaleY: reduceMotion ? 1 : 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: { trigger: '.story-list', start: 'top 70%', end: 'bottom 70%', scrub: 0.6 },
        }
      )

      gsap.utils.toArray('.story-item').forEach((item) => {
        ScrollTrigger.create({
          trigger: item,
          start: 'top 70%',
          onEnter: () => item.classList.add('is-lit'),
          onLeaveBack: () => item.classList.remove('is-lit'),
        })
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="storia" className="relative w-full py-20 md:py-28">
      <div className="mx-auto max-w-5xl px-5">
        <h2 className="text-center text-6xl text-ink md:text-7xl">La nostra storia</h2>

        <ol className="story-list relative mt-14 md:mt-20">
          <span
            className="absolute top-2 bottom-2 left-[0.6875rem] w-px bg-ink-soft/15 md:left-1/2"
            aria-hidden="true"
          />
          <span
            className="story-line absolute top-2 bottom-2 left-[0.6875rem] w-px bg-linear-to-b from-star via-star-soft to-sunset-300 md:left-1/2"
            aria-hidden="true"
          />

          {story.map((item, index) => {
            const isRight = index % 2 === 1
            const itemPhotos = item.photos.map(getPhoto).filter(Boolean).map((p) => gallery[galleryIndex.get(p.file)])
            return (
              <li
                key={item.title}
                className="story-item group relative grid gap-5 pb-14 pl-10 last:pb-0 md:grid-cols-2 md:gap-16 md:pl-0"
              >
                <span
                  className="absolute top-1.5 left-0 flex size-6 items-center justify-center md:left-1/2 md:-translate-x-1/2"
                  aria-hidden="true"
                >
                  <Sparkle className="size-4 text-ink-soft/40 transition-all duration-500 ease-out-expo group-[.is-lit]:scale-150 group-[.is-lit]:text-star group-[.is-lit]:drop-shadow-[0_0_8px_rgb(255_228_94_/_80%)]" />
                </span>

                <div className={`md:pt-0 ${isRight ? 'md:order-2 md:pl-2' : 'md:pr-2 md:text-right'}`}>
                  <h3 className="text-5xl text-ink">
                    {item.title}
                    <DraftBadge show={item.placeholder} />
                  </h3>
                  <p className="mt-2 font-bold text-ink-soft">
                    <time>{item.date}</time>
                  </p>
                  <p className="mt-3 max-w-prose text-ink-soft md:inline-block">{item.text}</p>
                </div>

                {itemPhotos.length > 0 && (
                  <div
                    className={`grid max-w-sm gap-4 ${itemPhotos.length > 1 ? 'grid-cols-2' : 'w-2/3 sm:w-1/2 md:w-60'} ${
                      isRight ? 'md:order-1 md:justify-self-end' : ''
                    }`}
                  >
                    {itemPhotos.map((photo, photoIndex) => (
                      <Photo key={photo.file} photo={photo} tilt={tilts[(index + photoIndex) % tilts.length]} onOpen={openPhoto} />
                    ))}
                  </div>
                )}
              </li>
            )
          })}
        </ol>
      </div>

      {stripPhotos.length > 0 && (
        <div className="mt-20">
          <h3 className="px-5 text-center text-5xl text-ink">Altri ricordi</h3>
          <p className="mt-2 px-5 text-center text-ink-soft">
            <span className="md:hidden">Scorri di lato e tocca una foto per ingrandirla.</span>
            <span className="hidden md:inline">Usa le frecce per scorrere e clicca una foto per ingrandirla.</span>
          </p>
          <div className="mt-4 hidden justify-center gap-3 md:flex">
            <button type="button" onClick={() => scrollStrip(-1)} aria-label="Foto precedenti" className="btn-icon btn-icon--outline">
              <ChevronLeft className="size-6" aria-hidden="true" />
            </button>
            <button type="button" onClick={() => scrollStrip(1)} aria-label="Foto successive" className="btn-icon btn-icon--outline">
              <ChevronRight className="size-6" aria-hidden="true" />
            </button>
          </div>
          <div ref={stripRef} className="photo-strip mx-auto mt-2 max-w-6xl">
            {stripPhotos.map((photo, index) => (
              <Photo
                key={photo.file}
                photo={gallery[galleryIndex.get(photo.file)]}
                tilt={tilts[index % tilts.length]}
                onOpen={openPhoto}
              />
            ))}
          </div>
        </div>
      )}

      {openIndex !== null && (
        <PhotoModal
          photos={gallery}
          index={openIndex}
          onChange={setOpenIndex}
          onClose={closePhoto}
          returnFocusRef={lastTriggerRef}
        />
      )}
    </section>
  )
}
