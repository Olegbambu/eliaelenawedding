import { useState } from 'react'
import { Minus, Plus } from 'lucide-react'
import Sparkle from './Sparkle'
import { wedding } from '../content'

const MAX_GUESTS = 10

function AttendanceOption({ value, checked, onChange, invalid, children }) {
  return (
    <label
      className={`group flex min-h-16 cursor-pointer items-center gap-4 border-b border-ink-soft/20 text-lg font-bold transition-colors duration-150 last:border-0 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-star ${
        checked ? 'text-star' : 'text-ink'
      }`}
    >
      <input
        type="radio"
        name="attendance"
        value={value}
        checked={checked}
        onChange={onChange}
        className="sr-only"
        aria-invalid={invalid || undefined}
        aria-describedby={invalid ? 'rsvp-attendance-error' : undefined}
      />
      <span
        className={`flex size-7 shrink-0 items-center justify-center rounded-full border-[1.5px] transition-colors duration-150 ${
          checked ? 'border-star' : 'border-ink-soft/60 group-hover:border-ink'
        }`}
        aria-hidden="true"
      >
        <Sparkle
          className={`size-4 text-star transition-[scale,opacity] duration-300 ease-out-expo motion-reduce:transition-none ${
            checked ? 'scale-100 opacity-100' : 'scale-40 opacity-0'
          }`}
        />
      </span>
      {children}
    </label>
  )
}

export default function Rsvp() {
  const [attendance, setAttendance] = useState('')
  const [guests, setGuests] = useState(1)
  // Names of everyone after the first person (the one filling in the form).
  const [companions, setCompanions] = useState([])
  const [status, setStatus] = useState('idle') // idle | sending | sent | error | unconfigured
  const [sentName, setSentName] = useState('')
  const [errors, setErrors] = useState({})

  const isAttending = attendance === 'yes'

  const changeGuests = (delta) => {
    const next = Math.min(MAX_GUESTS, Math.max(1, guests + delta))
    setGuests(next)
    setCompanions((current) => Array.from({ length: next - 1 }, (_, index) => current[index] ?? ''))
    setErrors((current) => ({ ...current, companions: current.companions?.slice(0, next - 1) }))
  }

  const setCompanion = (index, value) => {
    setCompanions((current) => current.map((name, i) => (i === index ? value : name)))
    if (errors.companions?.[index]) {
      setErrors((current) => ({ ...current, companions: current.companions.map((e, i) => (i === index ? false : e)) }))
    }
  }

  const chooseAttendance = (value) => {
    setAttendance(value)
    setErrors((current) => ({ ...current, attendance: false }))
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)
    const name = String(formData.get('name') ?? '').trim()

    const companionErrors = isAttending ? companions.map((companion) => !companion.trim()) : []
    const nextErrors = { name: !name, attendance: !attendance, companions: companionErrors }
    setErrors(nextErrors)
    const firstCompanionError = companionErrors.indexOf(true)
    if (nextErrors.name || nextErrors.attendance || firstCompanionError >= 0) {
      const target = nextErrors.name
        ? '#rsvp-name'
        : nextErrors.attendance
          ? 'input[name="attendance"]'
          : `#rsvp-companion-${firstCompanionError}`
      form.querySelector(target)?.focus()
      return
    }

    const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY
    if (!accessKey) {
      setStatus('unconfigured')
      return
    }

    formData.append('access_key', accessKey)
    formData.append('subject', `RSVP matrimonio: ${name} – ${isAttending ? `ci sarà (${guests})` : 'non ci sarà'}`)
    formData.append('from_name', 'Sito matrimonio Elia & Elena')
    if (isAttending) {
      // One line per person, so the email reads as a guest list.
      formData.append('partecipanti', [name, ...companions.map((companion) => companion.trim())].join('\n'))
    } else {
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
      setCompanions([])
    } catch {
      setStatus('error')
    }
  }

  const startOver = () => {
    setStatus('idle')
    setAttendance('')
    setErrors({})
  }

  return (
    <section id="rsvp" className="relative mx-auto w-full max-w-xl px-5 py-16 md:py-24">
      <div className="reveal">
        <h2 className="text-center text-6xl text-ink md:text-7xl">Ci sarai?</h2>
        <p className="mx-auto mt-4 max-w-md text-center text-ink-soft">
          Fatecelo sapere entro il <span className="font-bold text-star">{wedding.rsvpDeadline}</span>. Una
          risposta per famiglia basta.
        </p>

        {status === 'sent' ? (
          <div className="mt-10 text-center" role="status">
            <p className="font-heading text-5xl text-star">Grazie{sentName ? `, ${sentName}` : ''}!</p>
            <p className="mt-3 text-ink-soft">
              {isAttending ? 'Non vediamo l’ora di festeggiare con voi.' : 'Ci mancherete, grazie per avercelo detto.'}
            </p>
            <button type="button" onClick={startOver} className="btn-ghost mt-6">
              Invia un’altra risposta
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} noValidate className="mt-10 space-y-8">
            <div>
              <label htmlFor="rsvp-name" className="block font-bold text-ink">
                Nome e cognome
              </label>
              <input
                id="rsvp-name"
                type="text"
                name="name"
                autoComplete="name"
                required
                className="field"
                aria-invalid={errors.name || undefined}
                aria-describedby={errors.name ? 'rsvp-name-error' : undefined}
                onInput={() => errors.name && setErrors((current) => ({ ...current, name: false }))}
              />
              {errors.name && (
                <p id="rsvp-name-error" className="field-error">
                  Scrivi il tuo nome e cognome.
                </p>
              )}
            </div>

            <fieldset>
              <legend className="font-bold text-ink">Parteciperai?</legend>
              <div className="mt-1">
                <AttendanceOption
                  value="yes"
                  checked={attendance === 'yes'}
                  onChange={() => chooseAttendance('yes')}
                  invalid={errors.attendance}
                >
                  Ci sarò, con gioia
                </AttendanceOption>
                <AttendanceOption
                  value="no"
                  checked={attendance === 'no'}
                  onChange={() => chooseAttendance('no')}
                  invalid={errors.attendance}
                >
                  Purtroppo non potrò
                </AttendanceOption>
              </div>
              {errors.attendance && (
                <p id="rsvp-attendance-error" className="field-error">
                  Scegli una delle due risposte.
                </p>
              )}
            </fieldset>

            <div
              className={`grid transition-[grid-template-rows] duration-300 ease-out-expo motion-reduce:transition-none ${
                isAttending ? 'grid-rows-[1fr]' : '!mt-0 grid-rows-[0fr]'
              }`}
              inert={!isAttending}
            >
              <div className="min-h-0 space-y-8 overflow-hidden">
                <div>
                  <span id="rsvp-guests-label" className="block font-bold text-ink">
                    Quante persone siete?{' '}
                    <span className="font-normal text-ink-soft">(te compreso, anche bambini)</span>
                  </span>
                  <div className="mt-3 flex items-center gap-4" role="group" aria-labelledby="rsvp-guests-label">
                    <button
                      type="button"
                      onClick={() => changeGuests(-1)}
                      disabled={guests <= 1}
                      aria-label="Una persona in meno"
                      className="btn-icon btn-icon--outline"
                    >
                      <Minus className="size-5" aria-hidden="true" />
                    </button>
                    <output aria-live="polite" className="flex min-w-28 items-baseline justify-center gap-2 text-ink">
                      <span className="text-4xl font-light tabular-nums">{guests}</span>
                      <span className="text-ink-soft">{guests === 1 ? 'persona' : 'persone'}</span>
                    </output>
                    <button
                      type="button"
                      onClick={() => changeGuests(1)}
                      disabled={guests >= MAX_GUESTS}
                      aria-label="Una persona in più"
                      className="btn-icon btn-icon--outline"
                    >
                      <Plus className="size-5" aria-hidden="true" />
                    </button>
                    <input type="hidden" name="guests" value={guests} />
                  </div>
                </div>

                {companions.length > 0 && (
                  <fieldset>
                    <legend className="font-bold text-ink">
                      Chi viene con te? <span className="font-normal text-ink-soft">(nome e cognome)</span>
                    </legend>
                    <div className="mt-2 space-y-5">
                      {companions.map((companion, index) => {
                        const invalid = errors.companions?.[index]
                        return (
                          <div key={index} className="guest-row">
                            <label htmlFor={`rsvp-companion-${index}`} className="block text-ink-soft">
                              Persona {index + 2}
                            </label>
                            <input
                              id={`rsvp-companion-${index}`}
                              type="text"
                              autoComplete="off"
                              className="field"
                              value={companion}
                              onChange={(event) => setCompanion(index, event.target.value)}
                              aria-invalid={invalid || undefined}
                              aria-describedby={invalid ? `rsvp-companion-${index}-error` : undefined}
                            />
                            {invalid && (
                              <p id={`rsvp-companion-${index}-error`} className="field-error">
                                Scrivi nome e cognome della persona {index + 2}.
                              </p>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </fieldset>
                )}

                <div className="pb-1">
                  <label htmlFor="rsvp-allergies" className="block font-bold text-ink">
                    Allergie o intolleranze <span className="font-normal text-ink-soft">(facoltativo)</span>
                  </label>
                  <input
                    id="rsvp-allergies"
                    type="text"
                    name="allergies"
                    className="field"
                    placeholder="Es. celiachia, vegetariano"
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="rsvp-message" className="block font-bold text-ink">
                Un messaggio per noi <span className="font-normal text-ink-soft">(facoltativo)</span>
              </label>
              <textarea id="rsvp-message" name="message" rows="3" className="field" />
            </div>

            <input type="checkbox" name="botcheck" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />

            <div>
              <button type="submit" disabled={status === 'sending'} className="btn-star w-full">
                {status === 'sending' ? 'Invio in corso…' : 'Invia la risposta'}
              </button>
              <p role="status" aria-live="polite" className="mt-3 text-center text-sunset-200 empty:mt-0">
                {status === 'error' && 'Invio non riuscito. Controlla la connessione e riprova.'}
                {status === 'unconfigured' && 'Il modulo non è configurato. Contatta gli sposi per confermare.'}
              </p>
            </div>
          </form>
        )}
      </div>
    </section>
  )
}
