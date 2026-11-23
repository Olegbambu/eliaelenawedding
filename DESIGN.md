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
  field: "12px"
  panel: "16px"
  pill: "999px"
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
    rounded: "{rounded.panel}"
    padding: "40px 20px"
  field:
    backgroundColor: "{colors.night-900}"
    textColor: "{colors.ink}"
    rounded: "{rounded.field}"
    padding: "0.85rem 1rem"
  field-focus:
    backgroundColor: "#12053a"
  btn-star:
    backgroundColor: "{colors.star}"
    textColor: "{colors.night-900}"
    typography: "{typography.subtitle}"
    rounded: "{rounded.pill}"
    padding: "0 1.75rem"
    height: "3rem"
  btn-star-hover:
    backgroundColor: "{colors.star-soft}"
  btn-ghost:
    textColor: "{colors.star}"
    rounded: "{rounded.pill}"
    padding: "0 1.5rem"
    height: "3rem"
  choice-tile:
    backgroundColor: "{colors.night-900}"
    textColor: "{colors.ink}"
    rounded: "{rounded.field}"
    height: "3.5rem"
  choice-tile-selected:
    backgroundColor: "{colors.star}"
    textColor: "{colors.night-900}"
  polaroid:
    backgroundColor: "{colors.polaroid-paper}"
    rounded: "{rounded.print}"
    padding: "0.45rem 0.45rem 1.6rem"
  icon-button:
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
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

The system is quiet except for one signature moment. Star yellow is the voice of action and key facts (the date, times, buttons); everything else is off-white ink or lavender. Decoration (twinkling starfield, butterflies at the page edges, polaroid tilt) is ambient and never covers or delays information. Density is generous and phone-first: large type, 48px-plus targets, one column on mobile, two only where it helps on desktop.

Script headings (Alex Brush) carry the romance; Lato carries every fact. Motion is soft arrival, slow breathing and scroll-linked drawing, all disabled under reduced motion.

**Key Characteristics:**
- The page background is a single vertical night-to-sunset gradient, not per-section fills.
- Star yellow (`star`) is reserved for actions, focus, and the few facts guests need at a glance.
- Solid indigo panels with a faint star-yellow hairline; no glass, no blur on content.
- Alex Brush for headings only; Lato for everything a guest reads to act.
- The four-point sparkle is the world's only ornament glyph, reused from hero to timeline to nav.
- Real photos as white-bordered polaroids with a slight alternating tilt.

### Motion

- **Easing:** `--ease-out-expo` (`cubic-bezier(0.16, 1, 0.3, 1)`) for every state change; GSAP uses `expo.out`.
- **Durations:** 150ms for buttons and fields, 250-320ms for disclosures, prints and the viewer, 500ms for a lit sparkle, 0.8-1.1s for section and hero arrival, 2.2s for the constellation reveal.
- **Arrival:** sections rise 24px from 40% opacity once (never from invisible); hero items rise 18px from blur, staggered 120ms.
- **Ambient:** starfield twinkle and occasional yellow shooting star (paused off-screen), big constellation stars breathe (3.6s), four small butterflies drift at the page edges at 55% opacity.
- **Smooth scroll:** Lenis, 0.9s, skipped entirely under reduced motion.
- **Reduced motion:** all ambient loops, entrances, transitions on prints and FAQ icons, and the viewer animation are removed; the timeline line is drawn in full.

## Colors

A night-sky ramp that runs top to bottom of the page, one warm yellow accent, and two cool off-white inks.

### Primary
- **Star Yellow** (`star`): primary buttons, ghost-button text and border, focus outlines, caret, text selection, schedule times, the date in the hero, lit timeline sparkles, active nav link. The only saturated accent on dark ground.
- **Soft Starlight** (`star-soft`): hover state of the primary button and the middle stop of the timeline line.

### Secondary
- **Sunset Rose** (`sunset-300`) and **Sunset Apricot** (`sunset-200`): the horizon at the bottom of the page and the tail of the timeline line. Apricot also carries RSVP error/status text on the panel.
- **Sunset Plum** (`sunset-400`): the transition stop between dusk and sunset in the page gradient.

### Neutral
- **Deep Night** (`night-950`): page top, hero background, body fallback, translucent nav bar (92%) and photo viewer backdrop (94%).
- **Night** (`night-900`): field and choice-tile fill, text on star yellow, footer text on the sunset horizon, IBAN well (70%).
- **Midnight** (`night-800`), **Dusk** (`dusk-700`), **Dusk Violet** (`dusk-600`): middle stops of the page gradient (45%, 68%, 82%).
- **Indigo Panel** (`panel`): solid surface for the RSVP card and the venue/map card.
- **Moon Ink** (`ink`): headings and primary text.
- **Lavender Ink** (`ink-soft`): secondary text, notes, dividers and field borders at 15-35% opacity.
- **Polaroid Paper** (`polaroid-paper`): photo print border only.

`dusk-500` is defined in the theme but not currently used by any surface.

### Named Rules
**The Sky Is The Page Rule.** Sections never paint their own background colour. Depth of night is set by scroll position in the single page gradient (`night-950` 0% → `night-900` 22% → `night-800` 45% → `dusk-700` 68% → `dusk-600` 82% → `sunset-400` 90% → `sunset-300` 96% → `sunset-200` 100%).

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
- **Numeral** (Lato 300, 1.875rem → 3rem, tabular): countdown digits; schedule times use Lato 700 1.25rem tabular in star yellow.
- **Label** (Lato 700, 0.75rem, 0.1em, uppercase): countdown unit names only.

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

Depth comes from the sky itself, not from shadow. Surfaces are flat solid indigo panels outlined by a faint star-yellow hairline. The only real shadows belong to physical objects: the polaroid prints, which cast a deep violet shadow and lift on hover, and the hero names, which carry a dark halo so the script stays legible over the starfield. The nav becomes a translucent night bar with backdrop blur only after scrolling.

### Shadow Vocabulary
- **Print rest** (`box-shadow: 0 10px 24px rgb(5 0 25 / 45%)`): polaroids at rest.
- **Print lifted** (`box-shadow: 0 16px 32px rgb(5 0 25 / 55%)`): polaroid on hover/focus, with `translateY(-4px)` and the tilt straightened.
- **Name halo** (`drop-shadow(0 4px 24px rgb(8 2 29 / 90%))`): hero names only.
- **Star glow** (`drop-shadow(0 0 8px rgb(255 228 94 / 80%))`): a lit timeline sparkle.

### Named Rules
**The Only Paper Casts Shadow Rule.** Panels, fields and buttons are flat. A shadow means a physical photograph.

## Shapes

Soft and rounded for everything interactive, near-square for prints. Pills (999px) for all buttons and icon buttons; 12px for fields, choice tiles and the IBAN well; 16px for panels; 4px for the polaroid print and the full-size photo, 2px for the image inside the print. Borders are 1px hairlines: star yellow at 18% on panels and 45% on ghost buttons, lavender at 35% on fields and 15-20% on dividers. The recurring silhouette is the four-point sparkle star (a concave diamond, `M0 -10 L2.2 -2.2 L10 0 L2.2 2.2 L0 10 L-2.2 2.2 L-10 0 L-2.2 -2.2 Z`).

## Components

### Buttons
Confident, round, and impossible to miss with a thumb.
- **Shape:** full pill (999px), minimum height 48px, icon gap 8px.
- **Primary (btn-star):** star yellow fill, night text, Lato 700 with 0.02em tracking, 28px side padding. One per decision: "Conferma la presenza", "Invia la risposta", "Indicazioni", "Copia IBAN".
- **Hover / Active:** fill lightens to soft starlight; press scales to 0.97 on the expo ease (150ms). Disabled drops to 60% opacity with a wait cursor.
- **Ghost (btn-ghost):** transparent with a 45% star-yellow hairline and star-yellow text, 24px padding; hover adds a 10% star-yellow wash. Used for the secondary path beside a primary ("Programma e luogo", "Salva nel calendario") and, square at 48×48, for the photo-strip arrows.
- **Icon button:** 48px circle; in the nav it is star yellow on transparent with a 10% ink wash on hover; in the photo viewer it is ink on night at 80%.

### Cards / Containers (panel)
- **Corner Style:** 16px.
- **Background:** solid indigo panel.
- **Shadow Strategy:** none (see Elevation).
- **Border:** 1px star yellow at 18%.
- **Internal Padding:** 40px × 20px mobile, 40px desktop (RSVP); 24px below the map on the venue card, with the map flush to the top edge.

### Inputs / Fields
- **Style:** full width, night fill, 1px lavender border at 35%, 12px radius, 0.85rem × 1rem padding, 1rem text, star-yellow caret; placeholder lavender at 70%.
- **Hover:** border to 60% lavender.
- **Focus:** border turns star yellow and the fill deepens to `#12053a` (the global 2px star outline applies to keyboard focus elsewhere).
- **Choice tiles (attendance):** two 56px-tall 12px-radius tiles in a two-column grid; unselected night with lavender border, selected flips to star yellow fill with night text and a check icon. Keyboard focus draws the star outline around the tile.
- **Stepper:** 48px round minus/plus buttons with a lavender border that turns star yellow on hover, a 24px bold tabular count between them.
- **Status text:** apricot, small, in a live region below the submit button.

### Navigation
- Fixed 64px bar. Transparent over the hero; after 24px of scroll it becomes night at 92% with backdrop blur and a 15% star-yellow bottom hairline (300ms transition).
- E & E mark in star yellow on the left (script letters, Lato ampersand).
- Desktop: inline Lato 700 0.875rem links, lavender at rest, ink on hover, star yellow when current (`aria-current="location"`), with a small sparkle beneath.
- Mobile: a 48px menu button opens a stacked list of 1.125rem bold links; Escape and resize to desktop close it.

### Sparkle (signature)
The four-point star from the constellation, drawn in `currentColor`. In the hero it marks each constellation star with a breathing yellow halo; on the timeline it is the node for each chapter, dim lavender at 40% until scrolled into view, then star yellow at 1.5× scale with a glow (500ms expo); in the nav it sits under the links.

### Story timeline (signature)
A 1px vertical spine (left on mobile at 11px, centred on desktop): a lavender 15% track under a star → starlight → sunset-rose gradient line that draws itself with scroll (scrubbed `scaleY`). Chapters alternate sides on desktop; each has a script title, a bold lavender date and body text, with one or two polaroids beside it.

### Polaroid and photo strip
- **Polaroid:** paper-white print with 0.45rem sides and a 1.6rem bottom lip, 4px radius, 4:5 image cropped to cover, alternating tilt (-2°, 2°, -1°, 1°). On hover or focus it straightens and lifts (300ms expo). The whole print is a button that opens the viewer with a zoom-in cursor.
- **Photo strip:** horizontal scroll-snapping row of polaroids, each `min(62vw, 15rem)` wide with 20px gaps, thin star-yellow scrollbar; on desktop two ghost arrow buttons page it.
- **Photo viewer:** full-screen dialog over a 94% night backdrop, image fades and scales in from 0.96 (320ms), round close and prev/next buttons, tabular "n / total" counter.

### FAQ disclosure
Native `details` list between lavender 20% hairlines. Each summary is at least 64px tall, Lato 700 1.125rem in ink, star yellow on hover, with a star-yellow plus icon that rotates 45° into a cross when open (250ms expo). Where supported, the answer height animates open (300ms expo). Answers are lavender body text.

### Countdown
Four units in a row: light tabular numerals in ink above uppercase star-yellow labels; hidden from screen readers in favour of one sentence with the day count.

## Do's and Don'ts

### Do:
- **Do** let the single night-to-sunset page gradient be every section's background.
- **Do** keep star yellow for actions, focus, times and the date; everything else ink or lavender.
- **Do** use one `btn-star` per decision and pair it with a `btn-ghost` for the secondary path.
- **Do** keep every tap target at least 48px tall and body text at least 1rem.
- **Do** put facts in Lato and feelings in Alex Brush.
- **Do** show photos as tilted polaroids that straighten on hover and open the viewer.
- **Do** use the four-point sparkle as the only ornament glyph.
- **Do** give every looping or entrance animation a reduced-motion off switch.

### Don't:
- **Don't** use cream paper, a serif monogram, or a card grid: the generic wedding template is the anti-reference.
- **Don't** bury practical information (date, time, place, RSVP) under decoration or below the story.
- **Don't** set body text, labels or buttons in Alex Brush.
- **Don't** add shadows, glass or blur to panels and fields; only photographs cast shadows.
- **Don't** paint sections with their own background colour.
- **Don't** let butterflies or the starfield cover the content column or delay interaction.
- **Don't** ship the pink "bozza" draft badge style as part of the system: it is a dev-only marker for placeholder copy, rendered only in development, and placeholder copy must be replaced before publishing.
