import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function Gifts() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.gift-box', {
        y: 60,
        opacity: 0,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%',
          end: 'top 50%',
          scrub: 1,
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={sectionRef} id="gifts" className="col-span-full w-full py-4 text-center">
      <div className="gift-box glass-card w-full rounded-3xl p-10">
        <h2 className="text-5xl md:text-6xl text-star-yellow mb-4 font-heading">Lista Nozze</h2>
        <p className="text-star-muted mb-8 text-base font-light leading-relaxed">
          La vostra presenza è per noi il regalo più bello. Se desiderate aiutarci a realizzare il nostro viaggio dei sogni:
        </p>
        <div className="p-4 bg-night-dark border border-star-yellow/40 rounded-xl inline-block font-mono text-sm text-star-yellow select-all shadow-inner tracking-wider">
          IT16X0103036270000000717909
        </div>
      </div>
    </div>
  )
}