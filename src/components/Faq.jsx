import { Plus } from 'lucide-react'
import DraftBadge from './DraftBadge'
import { faq } from '../content'

export default function Faq() {
  return (
    <section id="faq" className="relative mx-auto w-full max-w-2xl px-5 py-16 md:py-24">
      <h2 className="reveal text-center text-6xl text-ink md:text-7xl">Domande utili</h2>
      <div className="faq-list reveal mt-10 border-t border-ink-soft/20">
        {faq.map((item) => (
          <details key={item.question} className="faq-item border-b border-ink-soft/20">
            <summary className="flex min-h-16 items-center justify-between gap-4 py-4 text-lg font-bold text-ink hover:text-star">
              <span>
                {item.question}
                <DraftBadge show={item.placeholder} />
              </span>
              <Plus className="faq-icon size-6 shrink-0 text-star" aria-hidden="true" />
            </summary>
            <p className="pb-5 text-ink-soft">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  )
}
