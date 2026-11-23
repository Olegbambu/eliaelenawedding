import { useState } from 'react'
import { Check, Minus, Plus } from 'lucide-react'
import { wedding } from '../content'

const MAX_GUESTS = 10

function AttendanceOption({ value, checked, onChange, children }) {
  return (
    <label
      className={`flex min-h-14 cursor-pointer items-center justify-center gap-2 rounded-xl border px-4 text-center font-bold transition-colors duration-150 has-focus-visible:outline-2 has-focus-visible:outline-offset-3 has-focus-visible:outline-star ${
        checked
          ? 'border-star bg-star text-night-900'
          : 'border-ink-soft/35 bg-night-900 text-ink hover:border-ink-soft/70'
      }`}
    >
      <input
        type="radio"
        name="attendance"
        value={value}
        checked={checked}
        onChange={onChange}
        className="sr-only"
        required
      />
      {checked && <Check className="size-4" aria-hidden="true" />}
      {children}
    </label>
  )
}

export default function Rsvp() {
  const [attendance, setAttendance] = useState('yes')
  const [guests, setGuests] = useState(1)
  const [status, setStatus] = useState('idle') // idle | sending | sent | error | unconfigured
  const [sentName, setSentName] = useState('')

  const isAttending = attendance === 'yes'

  const onSubmit = async (event) => {
    event.preventDefault()
    const form = event.currentTarget
    const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY
    if (!accessKey) {
      setStatus('unconfigured')
      return
    }

    const formData = new FormData(form)
    const name = String(formData.get('name')).trim()
    formData.append('access_key', accessKey)
    formData.append('subject', `RSVP matrimonio: ${name} – ${isAttending ? `ci sarà (${guests})` : 'non ci sarà'}`)
    formData.append('from_name', 'Sito matrimonio Elia & Elena')
    if (!isAttending) {
      formData.delete('guests')
      formData.delete('allergies')
    }
    setStatus('sending')

    try {
      const response = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: formData })
      const data = await response.json()
      if (!response.ok || !data.success) throw new Error('Submission failed')
      setSentName(name.split(' ')[0])
      setStatus('sent')
      form.reset()
      setGuests(1)
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="rsvp" className="relative mx-auto w-full max-w-2xl px-5 py-16 md:py-24">
      <div className="reveal panel px-5 py-10 sm:px-10">
        <h2 className="text-center text-6xl text-ink md:text-7xl">Ci sarai?</h2>
        <p className="mx-auto mt-4 max-w-md text-center text-ink-soft">
          Fatecelo sapere entro il <span className="font-bold text-ink">{wedding.rsvpDeadline}</span>. Una
          risposta per famiglia basta.
        </p>

        {status === 'sent' ? (
          <div className="mt-10 text-center" role="status">
            <p className="font-heading text-5xl text-star">Grazie{sentName ? `, ${sentName}` : ''}!</p>
            <p className="mt-3 text-ink-soft">
              {isAttending ? 'Non vediamo l’ora di festeggiare con voi.' : 'Ci mancherete, grazie per avercelo detto.'}
            </p>
            <button type="button" onClick={() => setStatus('idle')} className="btn-ghost mt-8">
              Invia un’altra risposta
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-10 space-y-6">
            <div>
              <label htmlFor="rsvp-name" className="mb-2 block font-bold text-ink">
                Nome e cognome
              </label>
              <input
                id="rsvp-name"
                type="text"
                name="name"
                autoComplete="name"
                required
                className="field"
                placeholder="Mario Rossi"
              />
            </div>

            <fieldset>
              <legend className="mb-2 font-bold text-ink">Parteciperai?</legend>
              <div className="grid grid-cols-2 gap-3">
                <AttendanceOption value="yes" checked={isAttending} onChange={() => setAttendance('yes')}>
                  Ci sarò
                </AttendanceOption>
                <AttendanceOption value="no" checked={!isAttending} onChange={() => setAttendance('no')}>
                  Non potrò
                </AttendanceOption>
              </div>
            </fieldset>

            {isAttending && (
              <>
                <div>
                  <span id="rsvp-guests-label" className="mb-2 block font-bold text-ink">
                    Quante persone siete?{' '}
                    <span className="font-normal text-ink-soft">(te compreso, anche bambini)</span>
                  </span>
                  <div className="flex items-center gap-3" role="group" aria-labelledby="rsvp-guests-label">
                    <button
                      type="button"
                      onClick={() => setGuests((n) => Math.max(1, n - 1))}
                      disabled={guests <= 1}
                      aria-label="Una persona in meno"
                      className="flex size-12 items-center justify-center rounded-full border border-ink-soft/35 text-ink hover:border-star disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                    >
                      <Minus className="size-5" aria-hidden="true" />
                    </button>
                    <output aria-live="polite" className="w-10 text-center text-2xl font-bold tabular-nums text-ink">
                      {guests}
                    </output>
                    <button
                      type="button"
                      onClick={() => setGuests((n) => Math.min(MAX_GUESTS, n + 1))}
                      disabled={guests >= MAX_GUESTS}
                      aria-label="Una persona in più"
                      className="flex size-12 items-center justify-center rounded-full border border-ink-soft/35 text-ink hover:border-star disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                    >
                      <Plus className="size-5" aria-hidden="true" />
                    </button>
                    <input type="hidden" name="guests" value={guests} />
                  </div>
                </div>

                <div>
                  <label htmlFor="rsvp-allergies" className="mb-2 block font-bold text-ink">
                    Allergie o intolleranze <span className="font-normal text-ink-soft">(facoltativo)</span>
                  </label>
                  <input
                    id="rsvp-allergies"
                    type="text"
                    name="allergies"
                    className="field"
                    placeholder="Es. celiachia, niente lattosio, vegetariano"
                  />
                </div>
              </>
            )}

            <div>
              <label htmlFor="rsvp-message" className="mb-2 block font-bold text-ink">
                Un messaggio per noi <span className="font-normal text-ink-soft">(facoltativo)</span>
              </label>
              <textarea id="rsvp-message" name="message" rows="3" className="field" />
            </div>

            <input type="checkbox" name="botcheck" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />

            <button type="submit" disabled={status === 'sending'} className="btn-star w-full">
              {status === 'sending' ? 'Invio in corso…' : 'Invia la risposta'}
            </button>

            <p role="status" aria-live="polite" className="min-h-6 text-center text-sm text-sunset-200">
              {status === 'error' && 'Invio non riuscito. Controlla la connessione e riprova.'}
              {status === 'unconfigured' && 'Il modulo non è configurato. Contatta gli sposi per confermare.'}
            </p>
          </form>
        )}
      </div>
    </section>
  )
}
