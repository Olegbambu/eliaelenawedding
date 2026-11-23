import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Rsvp from './Rsvp'
import Gifts from './Gifts'
import { MapPin } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

export default function Details() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.detail-card', {
        y: 100,
        opacity: 0,
        stagger: 0.2,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          end: 'top 40%',
          scrub: 1,
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="details" className="relative mx-auto flex min-h-dvh w-full max-w-5xl flex-col items-center justify-center px-4 py-20">
      <div className="mb-12 w-full text-center">
        <div className="inline-block rounded-full px-8 py-3 glass-card">
          <h2 className="font-heading text-5xl text-star-yellow md:text-6xl">Il Grande Giorno</h2>
        </div>
      </div>

      <div className="grid w-full items-stretch gap-8 md:grid-cols-2">
        <div className="detail-card rounded-2xl p-6 text-center glass-card md:p-8">
          <Rsvp>
            <p className="mb-8 text-sm text-star-white">Vi aspettiamo il 14 maggio 2027 alle ore 15:30</p>
            <p className="mb-8 text-sm text-star-white">Gli sposi chiedono gentilmente di vestirsi colorati.</p>
          </Rsvp>
        </div>

        <div className="detail-card rounded-2xl p-6 text-center glass-card md:p-8">
          <h3 className="mb-4 font-heading text-4xl text-star-white">Dove?</h3>
          <p className="mb-6 text-sm text-star-white">
            La cerimonia e il ricevimento si terranno al Parco della Vittoria:
            <br />
            <span className="font-bold">Via Bigolo 17/19, 35010 Trebaseleghe (PD)</span>
          </p>
          <a
            href="https://www.google.com/maps/search/?api=1&query=Parco+della+Vittoria+Via+Bigolo+17+Trebaseleghe"
            target="_blank"
            rel="noopener noreferrer"
            className="mb-6 inline-flex min-h-11 items-center gap-2 rounded-full border border-star-yellow/40 px-5 text-xs font-bold uppercase tracking-widest text-star-yellow hover:bg-star-white/10"
          >
            <MapPin className="size-4" aria-hidden="true" />
            Apri in Google Maps
            <span className="sr-only">(si apre in una nuova scheda)</span>
          </a>
          <iframe
            title="Mappa del ricevimento a Parco della Vittoria"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2792.636723005382!2d12.012298500000002!3d45.5777435!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4779336b67613c85%3A0xfc14c8d27ebaddd5!2sParco%20della%20Vittoria!5e0!3m2!1sit!2sit!4v1792751661659!5m2!1sit!2sit"
            className="h-72 w-full rounded-lg border-0 md:h-96"
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>

        <Gifts />
      </div>
    </section>
  )
}
