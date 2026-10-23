import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function Rsvp({ children }) {
  const sectionRef = useRef(null)
  const [result, setResult] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.rsvp-box', {
        scale: 0.9,
        opacity: 0,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          end: 'top 30%',
          scrub: 1,
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const onSubmit = async (event) => {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)
    formData.append('access_key', 'dbe169cd-f99a-43a0-a900-b2000ac00bc5')
    setIsSubmitting(true)
    setResult('')

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
      })
      const data = await response.json()

      if (!response.ok || !data.success) throw new Error('Submission failed')

      setResult('Grazie, la tua risposta è stata inviata!')
      form.reset()
    } catch {
      setResult('Invio non riuscito. Riprova tra poco.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div ref={sectionRef} id="rsvp" className="w-full text-center">
      <div className="rsvp-box w-full">
        <h2 className="mb-4 font-heading text-4xl text-star-yellow">Conferma presenza</h2>
        <div>
          {children}
        </div>
        <p className="mb-8 text-sm text-star-white">
          Vi preghiamo di farci sapere se sarete dei nostri entro il 14 Aprile 2027.
        </p>

        <form onSubmit={onSubmit} className="space-y-4 text-left">
          <div>
            <label htmlFor="rsvp-name" className="block text-xs uppercase tracking-wider mb-2 text-star-yellow font-bold">Nome e Cognome</label>
            <input id="rsvp-name" type="text" name="name" autoComplete="name" required className="w-full p-3.5 rounded-xl bg-night-dark/80 border border-star-white/30 text-star-white placeholder:text-white focus:outline-none focus:border-star-yellow" placeholder="Nome e Cognome" />
          </div>
          <div>
            <label htmlFor="rsvp-attendance" className="block text-xs uppercase tracking-wider mb-2 text-star-yellow font-bold">Parteciperai?</label>
            <select id="rsvp-attendance" name="attendance" required defaultValue="yes" className="w-full p-3.5 rounded-xl bg-night-dark/80 border border-star-white/30 text-star-white focus:outline-none focus:border-star-yellow">
              <option value="yes">Ci sarò</option>
              <option value="no">Non potrò esserci</option>
            </select>
          </div>
          <div>
            <label htmlFor="rsvp-message" className="block text-xs uppercase tracking-wider mb-2 text-star-yellow font-bold">Messaggio</label>
            <textarea id="rsvp-message" name="message" required className="w-full p-3.5 rounded-xl bg-night-dark/80 border border-star-white/30 text-star-white placeholder:text-white focus:outline-none focus:border-star-yellow" rows="4" placeholder="Conferma la tua presenza e aggiungi eventuali note o intolleranze" />
          </div>
          <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-star-yellow text-night-dark font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-star-white transition-all shadow-lg cursor-pointer disabled:opacity-60 disabled:cursor-wait">
            {isSubmitting ? 'Invio in corso...' : 'Invia Conferma'}
          </button>
          <p role="status" aria-live="polite" className="min-h-5 text-center text-sm text-star-muted">{result}</p>
        </form>
      </div>
    </div>
  )
}