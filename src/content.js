// All site copy lives here.
// Entries with `placeholder: true` are invented sample text: replace them with
// the real facts before publishing. In `npm run dev` they show a "bozza" badge.

export const wedding = {
  couple: 'Elia & Elena',
  dateISO: '2027-05-14T15:30:00+02:00',
  dateLabel: '14 maggio 2027',
  rsvpDeadline: '14 aprile 2027',
  venue: {
    name: 'Parco della Vittoria',
    address: 'Via Bigolo 17/19, 35010 Trebaseleghe (PD)',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Parco+della+Vittoria+Via+Bigolo+17+Trebaseleghe',
    embedUrl:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2792.636723005382!2d12.012298500000002!3d45.5777435!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4779336b67613c85%3A0xfc14c8d27ebaddd5!2sParco%20della%20Vittoria!5e0!3m2!1sit!2sit!4v1792751661659!5m2!1sit!2sit',
  },
  dressCode: 'Gli sposi chiedono gentilmente di vestirsi colorati.',
  iban: 'IT16X0103036270000000717909',
}

export const schedule = [
  { time: '15:30', title: 'Cerimonia', note: 'Nel giardino del parco' },
  { time: '16:30', title: 'Aperitivo', note: 'Brindisi sotto gli alberi', placeholder: true },
  { time: '19:30', title: 'Cena', note: 'Nella sala del parco', placeholder: true },
  { time: '22:00', title: 'Taglio della torta', note: '', placeholder: true },
  { time: '22:30', title: 'Si balla', note: 'Fino a quando ci reggono le gambe', placeholder: true },
]

// `photos` are file names in src/assets.
export const story = [
  {
    date: 'Giugno 2019',
    title: 'Il primo selfie',
    text: 'Una sera d’estate, una foto storta e la sensazione che sarebbe stata la prima di tante.',
    photos: ['IMG_20190626_201215.jpg'],
    placeholder: true,
  },
  {
    date: 'Estate 2020',
    title: 'Inseparabili',
    text: 'L’anno in cui il mondo si è fermato e noi abbiamo imparato a stare bene anche solo in due.',
    photos: ['IMG_20200626_090711.jpg', 'IMG_20200907_170240.jpg'],
    placeholder: true,
  },
  {
    date: 'Venezia',
    title: 'Il primo viaggio',
    text: 'Calli, vaporetti e una giornata di sole che ricordiamo ancora.',
    photos: ['IMG_6627.jpg'],
    placeholder: true,
  },
  {
    date: 'Al mare',
    title: 'Il nostro tramonto',
    text: 'Il cielo diventava viola e arancione: da lì è nato il colore di questo sito.',
    photos: ['IMG_3207.JPG'],
    placeholder: true,
  },
  {
    date: '31 dicembre 2025',
    title: 'Capodanno con le stelline',
    text: 'Mezzanotte, due stelline accese e un desiderio espresso a bassa voce.',
    photos: ['PXL_20251231_231347393.jpg', 'PXL_20251231_231350814.jpg'],
    placeholder: true,
  },
  {
    date: 'Gennaio 2026',
    title: 'Londra',
    text: 'Freddo, cappelli buffi e la certezza di voler girare il mondo insieme.',
    photos: ['PXL_20260109_132915925.jpg'],
    placeholder: true,
  },
  {
    date: '14 maggio 2027',
    title: 'Il grande giorno',
    text: 'Il capitolo che scriveremo con voi.',
    photos: [],
  },
]

export const faq = [
  {
    question: 'Dove posso parcheggiare?',
    answer: 'Il parco ha un parcheggio gratuito riservato agli ospiti, a pochi passi dall’ingresso.',
    placeholder: true,
  },
  {
    question: 'Ci sono alloggi vicini?',
    answer: 'Sì, ci sono alcuni hotel e B&B a Trebaseleghe e dintorni. Scriveteci e vi diamo qualche consiglio.',
    placeholder: true,
  },
  {
    question: 'Posso portare i bambini?',
    answer: 'Certo! Indicate nel modulo quante persone siete, bambini compresi.',
    placeholder: true,
  },
  {
    question: 'Come mi devo vestire?',
    answer: 'Colorati! Lasciate a casa il nero e scegliete il colore che vi fa stare bene. La cerimonia è all’aperto: meglio scarpe comode per il prato.',
    placeholder: true,
  },
  {
    question: 'Entro quando devo confermare?',
    answer: 'Entro il 14 aprile 2027, con il modulo qui sopra. Se cambiate idea, rimandatelo pure.',
  },
]
