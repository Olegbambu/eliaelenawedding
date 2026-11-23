import WeddingLogo from './WeddingLogo'
import { wedding } from '../content'

export default function Footer() {
  return (
    <footer className="relative z-10 px-5 pb-12 text-center text-night-900">
      <WeddingLogo className="text-5xl" />
      <p className="mt-2 font-bold">{wedding.dateLabel}</p>
      <p className="mt-1">Ci vediamo sotto le stelle.</p>
    </footer>
  )
}
