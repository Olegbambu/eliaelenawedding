---
name: Elia & Elena
description: Single-page wedding site in the couple's La La Land night sky, from deep night to a sunset horizon.
colors:
  night-950: "#08021d"
  night-900: "#0d0430"
  night-800: "#160843"
  dusk-700: "#26106a"
  dusk-600: "#3b1a8a"
  dusk-500: "#5a2ca3"
  sunset-400: "#a8448f"
  sunset-300: "#e06f86"
  sunset-200: "#ffb37c"
  panel: "#1b0b52"
  star: "#ffe45e"
  star-soft: "#fff3b0"
  ink: "#f8f4ff"
  ink-soft: "#d2c8f3"
  polaroid-paper: "#fffdf8"
typography:
  display:
    fontFamily: "Alex Brush, cursive"
    fontSize: "6rem"
    fontWeight: 400
    lineHeight: 1.05
  headline:
    fontFamily: "Alex Brush, cursive"
    fontSize: "4.5rem"
    fontWeight: 400
    lineHeight: 1.05
  title:
    fontFamily: "Alex Brush, cursive"
    fontSize: "3rem"
    fontWeight: 400
    lineHeight: 1.05
  subtitle:
    fontFamily: "Lato, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 700
    lineHeight: 1.6
  body:
    fontFamily: "Lato, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
  numeral:
    fontFamily: "Lato, sans-serif"
    fontSize: "3rem"
    fontWeight: 300
    lineHeight: 1
    fontFeature: "tnum"
  label:
    fontFamily: "Lato, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.1em"
rounded:
  photo: "2px"
  print: "4px"
  ticket: "4px"
  socket: "999px"
spacing:
  gutter: "20px"
  stack-sm: "12px"
  stack-md: "24px"
  stack-lg: "40px"
  section-mobile: "64px"
  section-desktop: "96px"
components:
  panel:
    backgroundColor: "{colors.panel}"
    rounded: "{rounded.print}"
  field:
    textColor: "{colors.ink}"
    padding: "0.7rem 0 0.6rem"
  btn-star:
    backgroundColor: "{colors.star}"
    textColor: "{colors.night-900}"
    typography: "{typography.subtitle}"
    rounded: "{rounded.ticket}"
    padding: "0 1.75rem"
    height: "3.25rem"
  btn-star-hover:
    backgroundColor: "{colors.star-soft}"
  btn-star-dusk:
    backgroundColor: "{colors.night-900}"
    textColor: "{colors.star}"
    rounded: "{rounded.ticket}"
  btn-ghost:
    textColor: "{colors.star}"
    padding: "0 0.25rem"
    height: "3rem"
  attendance-row:
    textColor: "{colors.ink}"
    height: "4rem"
  attendance-row-selected:
    textColor: "{colors.star}"
  iban-slip:
    backgroundColor: "{colors.polaroid-paper}"
    textColor: "{colors.night-900}"
    rounded: "{rounded.photo}"
  polaroid:
    backgroundColor: "{colors.polaroid-paper}"
    rounded: "{rounded.print}"
    padding: "0.45rem 0.45rem 1.6rem"
  icon-button:
    textColor: "{colors.ink}"
    rounded: "{rounded.ticket}"
    size: "3rem"
  faq-summary:
    textColor: "{colors.ink}"
    typography: "{typography.subtitle}"
    height: "4rem"
---

# Design System: Elia & Elena

## Overview

**Creative North Star: "A Night Under Their Own Stars"**

The page is one continuous sky. It opens in deep night where the couple's own constellation lights up star by star from the kiss, and as the guest scrolls the sky warms through dusk violet into a pink-orange sunset at the footer. Nothing sits on a paper card or a cream wedding template: the sky is the background, and practical information floats on it in solid indigo panels or directly on the gradient.

The system is quiet except for one signature moment. Star yellow is the voice of action and key facts (the date, times, buttons); everything else is off-white ink or lavender. Decoration (the deep starfield, an occasional shooting star, polaroid tilt) is ambient and never covers or delays information. Density is generous and phone-first: large type, 48px-plus targets, one column on mobile, two only where it helps on desktop.

Script headings (Alex Brush) carry the romance; Lato carries every fact. Motion is soft arrival, slow breathing and scroll-linked drawing, all disabled under reduced motion.

**Key Characteristics:**
- The page background is a single vertical night-to-sunset gradient, not per-section fills.
- Star yellow (`star`) is reserved for actions, focus, and the few facts guests need at a glance.
- Few containers: the RSVP sits straight on the sky; the venue card is a solid indigo print with a 4px corner and no outline. No glass, no blur.
- Alex Brush for headings only; Lato for everything a guest reads to act.
- The four-point sparkle is the world's only ornament glyph, reused from hero to timeline to nav, and on every control a guest touches: buttons, the attendance choice, the FAQ.
- Real photos as white-bordered polaroids with a slight alternating tilt.

### Motion

- **Easing:** `--ease-out-expo` (`cubic-bezier(0.16, 1, 0.3, 1)`) for every state change; GSAP uses `expo.out`.
- **Durations:** 150ms for buttons and fields, 250-320ms for disclosures, prints and the viewer, 500ms for a lit sparkle, 0.8-1.1s for section and hero arrival, 2.2s for the constellation reveal.
- **Arrival:** sections rise 24px from 40% opacity once (never from invisible); hero items rise 18px from blur, staggered 120ms.
- **Ambient:** big constellation stars breathe (3.6s). Every 6-14s a single shooting star crosses a random part of the screen (star-yellow head fading to white, ~0.8s), never on the sunset, never while the tab is hidden, never under reduced motion.
- **Deep sky (signature, WebGL):** behind the whole page, hero included, a fixed Three.js layer (`DeepSky.jsx`, `lib/deepSkyScene.js`) holds 1,100 (phone) to 2,200 stars on depth layers from 60 to 620 units. Scrolling slides them past at speeds inversely proportional to depth, so the guest travels through the sky; the mouse leans the camera a few units. Near bright stars are drawn as the four-point sparkle. They twinkle, fade out across the last 14% of the page into the sunset, and a button press sends a ring of light through them. Loaded right after first paint (idle, 400ms timeout) and faded in over 1.2s; Save-Data, ≤2 GB memory, ≤2 cores or no WebGL get a still 2D sky of dots instead; still frame under reduced motion.
- **Handwritten headings:** each `main h2` writes itself left to right (clip-path, 1.5s `power2.inOut`) with a glowing sparkle riding the pen tip, once, when it reaches 86% of the viewport.
- **Button press:** buttons never follow the pointer (tried, felt nagging). A press throws 11 sparkles upward (0.8-1.2s) and pings the deep sky.
- **Polaroid pickup (mouse only):** the print tips up to 9° toward the pointer in 3D, lifts 10px and scales 1.05; a gloss highlight and a faint gold-rose sheen follow the pointer, the shadow falls away from the raised edge, and a gold star lights on the lip.
- **Smooth scroll:** Lenis, 0.9s, skipped entirely under reduced motion.
- **Reduced motion:** Lenis, section arrival, handwritten headings, button bursts, polaroid tilt, all ambient loops, the RSVP reveal and the viewer animation are off; the deep sky is a still frame; the timeline line is drawn in full.

## Colors

A night-sky ramp that runs top to bottom of the page, one warm yellow accent, and two cool off-white inks.

### Primary
- **Star Yellow** (`star`): primary buttons, ghost-button text and border, focus outlines, caret, text selection, schedule times, the date in the hero, lit timeline sparkles, active nav link. The only saturated accent on dark ground.
- **Soft Starlight** (`star-soft`): hover state of the primary button and the middle stop of the timeline line.

### Secondary
- **Sunset Rose** (`sunset-300`) and **Sunset Apricot** (`sunset-200`): the horizon at the bottom of the page and the tail of the timeline line. Apricot also carries RSVP field errors (text and the field line) and status text.
- **Sunset Plum** (`sunset-400`): the transition stop between dusk and sunset in the page gradient.

### Neutral
- **Deep Night** (`night-950`): page top, hero background, body fallback, solid nav bar (96%, no blur) and photo viewer backdrop (94%).
- **Night** (`night-900`): text on star yellow, the IBAN slip and the footer text on the sunset horizon.
- **Midnight** (`night-800`), **Dusk** (`dusk-700`), **Dusk Violet** (`dusk-600`): middle stops of the page gradient (45%, 68%, 82%).
- **Indigo Panel** (`panel`): solid surface for the venue/map card.
- **Moon Ink** (`ink`): headings and primary text.
- **Lavender Ink** (`ink-soft`): secondary text, notes, countdown unit names, dividers at 12-20%, the field writing line at 45% (75% on hover).
- **Polaroid Paper** (`polaroid-paper`): photo print border and the IBAN slip.

`dusk-500` is defined in the theme but not currently used by any surface.

### Named Rules
**The Sky Is The Page Rule.** Sections never paint their own background colour. Depth of night is set by scroll position in the single page gradient (`night-950` 0% → `night-900` 22% → `night-800` 45% → `dusk-700` 68% → `dusk-600` 82% → `sunset-400` at 100% − 44svh → `sunset-300` at 100% − 22svh → `sunset-200` 100%). The sunset lives only in the footer (min 44svh tall), so every section above it keeps light ink at ≥4.5:1, and only the footer is set in night ink.

**The One Star Rule.** Star yellow marks what a guest can do or must know. If it is not an action, a focus state, a time, or the date, it is ink or lavender.

## Typography

**Display Font:** Alex Brush (with cursive)
**Body Font:** Lato 300/400/700 (with sans-serif)

**Character:** A flowing hand-lettered script for names and section titles, against a clear, friendly humanist sans that older guests read easily on a phone.

### Hierarchy
- **Display** (Alex Brush 400, 3.75rem mobile → 4.5rem → 6rem desktop, 1.05): the couple's names in the hero only, with a soft dark drop shadow.
- **Headline** (Alex Brush 400, 3.75rem mobile, 4.5rem desktop, 1.05): section titles ("Il programma", "Ci sarai?", "La nostra storia"), centred.
- **Title** (Alex Brush 400, 3rem, 1.05): timeline chapter titles, "Altri ricordi", the RSVP thank-you.
- **Subtitle** (Lato 700, 1.125rem): schedule item titles, venue name, FAQ questions, form labels (at body size).
- **Body** (Lato 400, 1.0625rem, 1.6): all running text; paragraphs held to `max-w-md` (28rem) or `max-w-prose`.
- **Numeral** (Lato 300, 1.875rem → 3rem, tabular): countdown digits and the RSVP guest count (2.25rem); schedule times use Lato 700 1.25rem tabular in star yellow.
- **Label** (Lato 400, 0.875rem, lowercase, lavender): countdown unit names only. No uppercase tracked labels anywhere.

### Named Rules
**The Script For Feeling Rule.** Alex Brush is used for headings h1-h3 and the E & E mark, never for a fact, a button, a label, or a sentence a guest must read to act.

**The Big Text Rule.** Body never drops below 1rem; interactive labels are bold. Headings use `text-wrap: balance`, paragraphs `text-wrap: pretty`.

## Layout

Single long page, phone first, practical sections first: Hero → Programma (schedule + venue map) → RSVP → Storia (timeline + photo strip) → FAQ → Lista nozze → footer on the sunset.

- **Gutter:** 20px side padding on every section.
- **Section rhythm:** 64px vertical on mobile, 96px on desktop (programme and story open slightly larger, 96-128px top).
- **Measures:** reading and form sections cap at 42rem; schedule and story at 64rem; nav and photo strip at 72rem.
- **Breakpoints:** Tailwind defaults; `sm` (640px) turns stacked buttons into a row, `md` (768px) is where the schedule goes two-column, the timeline centres its spine and alternates sides, and the nav shows inline links.
- **Hero:** full small-viewport height; constellation in the top 38svh (42svh desktop), names, date, countdown and both CTAs above the fold on a 390×844 phone. Buttons are full-width on mobile.
- **Anchor offset:** `scroll-padding-top: 5.5rem` so the fixed 64px nav never covers a section title.

## Elevation & Depth

Depth comes from the sky itself, not from shadow. The one panel is flat solid indigo with no outline. The only real shadows belong to physical paper: the polaroid prints, which cast a deep violet shadow and lift on hover, and the IBAN slip; the hero names carry a dark halo so the script stays legible over the starfield. The nav becomes a solid night bar only after scrolling.

### Shadow Vocabulary
- **Print rest** (`box-shadow: 0 10px 24px rgb(5 0 25 / 45%)`): polaroids at rest and the IBAN slip.
- **Print lifted** (`box-shadow: 0 16px 32px rgb(5 0 25 / 55%)`): polaroid on hover/focus, with `translateY(-4px)` and the tilt straightened.
- **Name halo** (`drop-shadow(0 4px 24px rgb(8 2 29 / 90%))`): hero names only.
- **Star glow** (`drop-shadow(0 0 8px rgb(255 228 94 / 80%))`): a lit timeline sparkle.

### Named Rules
**The Only Paper Casts Shadow Rule.** Panels, fields and buttons are flat. A shadow means a physical piece of paper: a photograph or the IBAN slip.

## Shapes

Everything comes from the print family: near-square. 4px for the polaroid print, the full-size photo, the venue panel, the primary ticket button and icon buttons; 2px for the image inside the print and the IBAN slip; 0 for fields, which are lines, not boxes. The only circles are the attendance sockets. No pills. Borders are 1px hairlines: lavender at 40% on outlined icon buttons, 12-20% on dividers. The recurring silhouette is the four-point sparkle star (a concave diamond, `M0 -10 L2.2 -2.2 L10 0 L2.2 2.2 L0 10 L-2.2 2.2 L-10 0 L-2.2 -2.2 Z`).

## Components

### Buttons
Tickets and written words, not pills. Every button carries the sparkle on its leading edge; lucide icons are not used inside labelled buttons.
- **Primary (btn-star), the ticket:** star yellow fill, night text, Lato 700 1.0625rem, 4px corner, 3.25rem tall, 28px side padding, a 0.75rem sparkle before the label. Hover lightens to soft starlight, sweeps a band of white light across the face (900ms expo) and turns the sparkle 45°; press sinks 1px. Disabled at 70% with a wait cursor. One per decision: "Conferma la presenza", "Invia la risposta", "Indicazioni", "Copia IBAN". Full width on mobile.
- **Ghost (btn-ghost), the written path:** no box. Star-yellow Lato 700 words over a 45% underline; on hover a full-strength line draws over it from the left (450ms expo) while the leading sparkle grows from 0.6 to full. Used for the secondary path beside a ticket ("Programma e luogo", "Salva nel calendario", "Invia un'altra risposta").
- **Icon button (btn-icon):** 48px square, 4px corner, no fill; ink, star yellow on hover. The `--outline` variant adds a 40% lavender hairline (photo-strip arrows, guest stepper). Used bare in the nav (star yellow) and the photo viewer (ink with a soft dark drop shadow over the photo).

### Cards / Containers (panel)
- Only the venue card is a panel: solid indigo, 4px corner, no border, no shadow, map flush to the top, 24px padding below.
- The RSVP form has no container: it sits on the sky like the programme list.

### Inputs / Fields
- **Writing line (field):** no box, no fill. A 1.5px lavender line at 45% under the text (75% on hover), 1.0625rem Lato, star caret, placeholder lavender at 70%. Focus draws a 2px star-yellow line from the left over the rest line (280ms expo). The textarea is the same line, 5.5rem tall, vertical resize only.
- **Errors:** validated on submit, not by the browser bubble. The line turns apricot (`aria-invalid`), an apricot sentence sits under the field ("Scrivi il tuo nome e cognome.", "Scegli una delle due risposte."), and focus moves to the first problem.
- **Attendance rows:** nothing preselected. Two full-width 4rem rows between 20% lavender hairlines, each with a 1.75rem round socket ringed in lavender. Choosing one fills its socket with a star-yellow sparkle (scale 0.4 → 1, 300ms expo) and turns its words star yellow. Copy: "Ci sarò, con gioia" / "Purtroppo non potrò". Guest count and allergies open below only after "Ci sarò" (grid rows 0fr → 1fr, 300ms expo) and are inert while closed.
- **Guest names:** above one person, a "Chi viene con te?" group adds one writing line per extra guest ("Persona 2", "Persona 3"…), each sliding in from 8px above (350ms expo). They are required; lowering the count drops the last lines and keeps the rest. The email gets a `partecipanti` field with one name per line.
- **Stepper:** outlined square icon buttons around a Lato 300 2.25rem tabular count followed by "persona" / "persone". At the limit the button greys to lavender 35%, not a faded opacity.
- **Status text:** apricot body text in a live region below the submit button, with no reserved empty space.

### Navigation
- Fixed 64px bar. Transparent over the hero; after 24px of scroll it becomes solid night at 96% with a 15% star-yellow bottom hairline (300ms transition). No blur.
- E & E mark in star yellow on the left (script letters, Lato ampersand).
- Desktop: inline Lato 700 0.9375rem links, lavender at rest. Hover or keyboard focus turns the word ink and draws a 1px ink line out from its centre (300ms expo). The current link (`aria-current="location"`) is star yellow with a small sparkle beneath and no hover line.
- Mobile: a 48px square menu button opens a stacked list of 3.5rem rows in 1.125rem bold, divided by 12% lavender hairlines; the current one is star yellow with a leading sparkle. Escape and resize to desktop close it.

### Sparkle (signature)
The four-point star from the constellation, drawn in `currentColor`. In the hero it marks each constellation star with a breathing yellow halo; on the timeline it is the node for each chapter, dim lavender at 40% until scrolled into view, then star yellow at 1.5× scale with a glow (500ms expo); in the nav it sits under the links; on buttons it leads the label; in the RSVP it fills the chosen socket; in the FAQ it lights when an answer is open.

### Story timeline (signature)
A 1px vertical spine (left on mobile at 11px, centred on desktop): a lavender 15% track under a star → starlight → sunset-rose gradient line that draws itself with scroll (scrubbed `scaleY`). Chapters alternate sides on desktop; each has a script title, a bold lavender date and body text, with one or two polaroids beside it.

### Polaroid and photo strip
- **Polaroid:** paper-white print with 0.45rem sides and a 1.6rem bottom lip, 4px radius, 4:5 image cropped to cover, alternating tilt (-2°, 2°, -1°, 1°). On hover or focus it straightens, lifts and tips toward the pointer with gloss and a gold lip star (see Motion; 700ms expo settle). The whole print is a button that opens the viewer with a zoom-in cursor.
- **Photo strip:** horizontal scroll-snapping row of polaroids (vertical wheel passes through to the page scroll; never `data-lenis-prevent`), each `min(62vw, 15rem)` wide with 20px gaps, thin star-yellow scrollbar; on desktop two ghost arrow buttons page it.
- **Photo viewer:** full-screen dialog over a 94% night backdrop, image fades and scales in from 0.96 (320ms), bare square close and prev/next icon buttons (no discs), tabular "n / total" counter at body size.

### FAQ disclosure
Native `details` list between lavender 20% hairlines. Each summary is at least 64px tall, Lato 700 1.125rem in ink; hover underlines the question in lavender (yellow stays for actions). A sparkle on the right sits lavender at 55% when closed and, when open, turns 45° into a star-yellow cross and grows 1.15× (350ms expo): a lit star means an open answer. Where supported, the answer height animates open (300ms expo). Answers are lavender body text.

### Countdown
Three units (giorni, ore, minuti; no ticking seconds), refreshed every 10s: light tabular numerals in ink above lowercase lavender labels; hidden from screen readers in favour of one sentence with the day count.

## Do's and Don'ts

### Do:
- **Do** let the single night-to-sunset page gradient be every section's background.
- **Do** keep star yellow for actions, focus, times and the date; everything else ink or lavender.
- **Do** use one `btn-star` ticket per decision and pair it with a `btn-ghost` written link for the secondary path.
- **Do** keep every tap target at least 48px tall and body text at least 1rem.
- **Do** put facts in Lato and feelings in Alex Brush.
- **Do** show photos as tilted polaroids that straighten on hover and open the viewer.
- **Do** use the four-point sparkle as the only ornament glyph.
- **Do** give every looping or entrance animation a reduced-motion off switch.
- **Do** keep buttons still under the pointer; motion that follows the mouse belongs to the photos, not to controls.

### Don't:
- **Don't** use cream paper, a serif monogram, or a card grid: the generic wedding template is the anti-reference.
- **Don't** bury practical information (date, time, place, RSVP) under decoration or below the story.
- **Don't** set body text, labels or buttons in Alex Brush.
- **Don't** add shadows, glass or blur to panels and fields; only photographs cast shadows.
- **Don't** paint sections with their own background colour.
- **Don't** let the starfield or shooting stars cover the content column or delay interaction.
- **Don't** bring back butterflies or other off-theme creatures: the sky is the only ambient layer.
- **Don't** use pills, boxed rounded fields, uppercase tracked labels or lucide icons inside labelled buttons: they are the generic-UI anti-reference for controls.
- **Don't** preselect an answer the guest has to give.
- **Don't** ship the pink "bozza" draft badge style as part of the system: it is a dev-only marker for placeholder copy, rendered only in development, and placeholder copy must be replaced before publishing.
