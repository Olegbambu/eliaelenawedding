import { Fragment, useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { wedding } from '../content'

const ibanGroups = wedding.iban.match(/.{1,4}/g)

export default function Gifts() {
  const [copied, setCopied] = useState(false)

  const copyIban = async () => {
    try {
      await navigator.clipboard.writeText(wedding.iban)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      setCopied(false)
    }
  }

  return (
    <section id="regali" className="relative mx-auto w-full max-w-2xl px-5 pt-16 pb-28 text-center md:pt-24 md:pb-36">
      <h2 className="reveal text-6xl text-ink md:text-7xl">Lista nozze</h2>
      <p className="reveal mx-auto mt-5 max-w-md text-ink">
        La vostra presenza è il regalo più bello. Se volete aiutarci a realizzare il viaggio dei nostri sogni, potete
        farlo con un bonifico.
      </p>
      <div className="reveal mt-8 flex flex-col items-center gap-4">
        <p className="w-full rounded-xl bg-night-900/70 px-4 py-4 text-lg font-bold text-ink tabular-nums select-all [text-wrap:balance] sm:w-auto sm:px-6 sm:tracking-wider">
          <span className="sr-only">IBAN: </span>
          {ibanGroups.map((group, index) => (
            <Fragment key={index}>
              {index > 0 && ' '}
              <span className="whitespace-nowrap">{group}</span>
            </Fragment>
          ))}
        </p>
        <button type="button" onClick={copyIban} className="btn-star">
          {copied ? <Check className="size-4" aria-hidden="true" /> : <Copy className="size-4" aria-hidden="true" />}
          {copied ? 'IBAN copiato' : 'Copia IBAN'}
        </button>
        <span role="status" aria-live="polite" className="sr-only">
          {copied ? 'IBAN copiato negli appunti' : ''}
        </span>
      </div>
    </section>
  )
}
