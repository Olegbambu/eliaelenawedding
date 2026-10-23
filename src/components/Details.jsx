import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Rsvp from './Rsvp'
import Gifts from './Gifts'

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
          <p className="mb-8 text-sm text-star-white">
            La cerimonia e l&apos;evento si terranno presso Parco della Vittoria a PADOVA:
            <br />
            Via Bigolo 17/19, Trebaseleghe, Italy, 35010
          </p>
          <iframe
            title="Mappa del ricevimento a Parco della Vittoria"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2792.636723005382!2d12.012298500000002!3d45.5777435!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4779336b67613c85%3A0xfc14c8d27ebaddd5!2sParco%20della%20Vittoria!5e0!3m2!1sit!2sit!4v1792751661659!5m2!1sit!2sit"
            className="h-128 w-full rounded-lg border-0"
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
