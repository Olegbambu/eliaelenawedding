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
    const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY
    if (!accessKey) {
      setResult('Il modulo non è configurato. Contatta gli sposi per confermare.')
      return
    }

    const formData = new FormData(form)
    formData.append('access_key', accessKey)
    const name = formData.get('name')
    const attending = formData.get('attendance') === 'yes'
    formData.append('subject', `RSVP matrimonio: ${name} – ${attending ? 'ci sarà' : 'non ci sarà'}`)
    formData.append('from_name', 'Sito matrimonio Elia & Elena')
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
        <h3 className="mb-4 font-heading text-4xl text-star-yellow">Conferma presenza</h3>
        <div>
          {children}
        </div>
        <p className="mb-8 text-sm text-star-white">
          Vi preghiamo di farci sapere se sarete dei nostri entro il 14 Aprile 2027.
        </p>

        <form onSubmit={onSubmit} className="space-y-4 text-left">
          <div>
            <label htmlFor="rsvp-name" className="block text-xs uppercase tracking-wider mb-2 text-star-yellow font-bold">Nome e Cognome</label>
            <input id="rsvp-name" type="text" name="name" autoComplete="name" required className="w-full p-3.5 rounded-xl bg-night-dark/80 border border-star-white/30 text-star-white placeholder:text-star-white/50 focus:outline-none focus:border-star-yellow" placeholder="Mario Rossi" />
          </div>
          <div>
            <label htmlFor="rsvp-attendance" className="block text-xs uppercase tracking-wider mb-2 text-star-yellow font-bold">Parteciperai?</label>
            <select id="rsvp-attendance" name="attendance" required defaultValue="yes" className="w-full p-3.5 rounded-xl bg-night-dark/80 border border-star-white/30 text-star-white focus:outline-none focus:border-star-yellow">
              <option value="yes">Ci sarò</option>
              <option value="no">Non potrò esserci</option>
            </select>
          </div>
          <div>
            <label htmlFor="rsvp-message" className="block text-xs uppercase tracking-wider mb-2 text-star-yellow font-bold">Messaggio <span className="font-normal normal-case tracking-normal text-star-white/70">(facoltativo)</span></label>
            <textarea id="rsvp-message" name="message" className="w-full p-3.5 rounded-xl bg-night-dark/80 border border-star-white/30 text-star-white placeholder:text-star-white/50 focus:outline-none focus:border-star-yellow" rows="4" placeholder="Eventuali note, allergie o intolleranze" />
          </div>
          <input type="checkbox" name="botcheck" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />
          <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-star-yellow text-night-dark font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-star-white transition-all shadow-lg cursor-pointer disabled:opacity-60 disabled:cursor-wait">
            {isSubmitting ? 'Invio in corso...' : 'Invia Conferma'}
          </button>
          <p role="status" aria-live="polite" className="min-h-5 text-center text-sm text-star-muted">{result}</p>
        </form>
      </div>
    </div>
  )
}