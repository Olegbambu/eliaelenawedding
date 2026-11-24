import WeddingLogo from './WeddingLogo'
import { wedding } from '../content'

export default function Footer() {
  return (
    <footer className="relative z-10 flex min-h-[44svh] flex-col items-center justify-end px-5 pb-12 text-center text-night-900">
      <WeddingLogo className="text-5xl" />
      <p className="mt-2 font-bold">{wedding.dateLabel}</p>
      <p className="mt-1">Ci vediamo presto!</p>
    </footer>
  )
}
