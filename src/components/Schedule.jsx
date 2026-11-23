import { CalendarPlus, MapPin, Navigation } from 'lucide-react'
import DraftBadge from './DraftBadge'
import { schedule, wedding } from '../content'

function downloadCalendarEvent() {
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Elia e Elena//Matrimonio//IT',
    'BEGIN:VEVENT',
    'UID:matrimonio-elia-elena-20270514@eliaelena',
    'DTSTAMP:20261101T000000Z',
    'DTSTART:20270514T133000Z',
    'DTEND:20270514T220000Z',
    'SUMMARY:Matrimonio di Elia & Elena',
    `LOCATION:${wedding.venue.name}\\, ${wedding.venue.address.replace(/,/g, '\\,')}`,
    'DESCRIPTION:Ci sposiamo! Tutti i dettagli sul sito.',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
  const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }))
  const link = document.createElement('a')
  link.href = url
  link.download = 'matrimonio-elia-elena.ics'
  link.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export default function Schedule() {
  return (
    <section id="programma" className="relative mx-auto w-full max-w-5xl px-5 pt-24 pb-16 md:pt-32">
      <h2 className="reveal text-center text-6xl text-ink md:text-7xl">Il programma</h2>
      <p className="reveal mx-auto mt-4 max-w-md text-center text-ink-soft">
        {wedding.dateLabel}. {wedding.dressCode}
      </p>

      <div className="mt-12 grid gap-10 md:grid-cols-[1fr_1fr] md:gap-14">
        <ol className="reveal">
          {schedule.map((item) => (
            <li
              key={item.time}
              className="grid grid-cols-[4.5rem_1fr] items-baseline gap-4 border-b border-ink-soft/15 py-4 first:pt-0 last:border-0"
            >
              <span className="text-xl font-bold tabular-nums text-star">{item.time}</span>
              <span>
                <span className="block text-lg font-bold text-ink">
                  {item.title}
                  <DraftBadge show={item.placeholder} />
                </span>
                {item.note && <span className="block text-ink-soft">{item.note}</span>}
              </span>
            </li>
          ))}
        </ol>

        <div className="reveal panel overflow-hidden">
          <iframe
            title={`Mappa: ${wedding.venue.name}`}
            src={wedding.venue.embedUrl}
            className="block h-56 w-full border-0 md:h-64"
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          />
          <div className="p-6">
            <h3 className="flex items-center gap-2 font-body text-lg font-bold text-ink">
              <MapPin className="size-5 shrink-0 text-star" aria-hidden="true" />
              {wedding.venue.name}
            </h3>
            <p className="mt-1 text-ink-soft">{wedding.venue.address}</p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <a href={wedding.venue.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn-star">
                <Navigation className="size-4" aria-hidden="true" />
                Indicazioni
                <span className="sr-only">(si apre Google Maps)</span>
              </a>
              <button type="button" onClick={downloadCalendarEvent} className="btn-ghost">
                <CalendarPlus className="size-4" aria-hidden="true" />
                Salva nel calendario
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
