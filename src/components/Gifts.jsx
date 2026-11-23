import { useEffect, useRef, useState } from 'react'
import { Check, Copy } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const IBAN = 'IT16X0103036270000000717909'

export default function Gifts() {
  const sectionRef = useRef(null)
  const [copied, setCopied] = useState(false)

  const copyIban = async () => {
    try {
      await navigator.clipboard.writeText(IBAN)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      setCopied(false)
    }
  }

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
        <h3 className="text-5xl md:text-6xl text-star-yellow mb-4 font-heading">Lista Nozze</h3>
        <p className="text-star-muted mb-8 text-base font-light leading-relaxed">
          La vostra presenza è per noi il regalo più bello. Se desiderate aiutarci a realizzare il nostro viaggio dei sogni:
        </p>
        <div className="flex flex-col items-center gap-3">
          <p className="text-xs uppercase tracking-wider text-star-yellow font-bold">IBAN</p>
          <p className="max-w-full break-all p-4 bg-night-dark border border-star-yellow/40 rounded-xl font-mono text-sm text-star-yellow select-all shadow-inner tracking-wider">
            {IBAN}
          </p>
          <button
            type="button"
            onClick={copyIban}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-star-yellow/40 px-5 text-xs font-bold uppercase tracking-widest text-star-yellow hover:bg-star-white/10 cursor-pointer"
          >
            {copied ? <Check className="size-4" aria-hidden="true" /> : <Copy className="size-4" aria-hidden="true" />}
            {copied ? 'Copiato!' : 'Copia IBAN'}
          </button>
          <span role="status" aria-live="polite" className="sr-only">{copied ? 'IBAN copiato negli appunti' : ''}</span>
        </div>
      </div>
    </div>
  )
}