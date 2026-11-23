---
version: 1
slug: "src-app-jsx"
primary_target: "src/App.jsx"
related_targets: ["src/components"]
---

# Wedding site home (single page)

Scope: the whole single-page site (`src/App.jsx` and its sections). Visitor mode: Persuade (guests must confirm attendance), with practical information as the main job.

Audience: wedding guests of every age, almost all on a phone from a WhatsApp link. Job: find date, time and place in seconds, send the RSVP, look at the couple's photos. Constraints: Italian copy, mid-range phones, older guests (large text and targets), reduced motion respected. Placeholder copy is marked `placeholder: true` in `src/content.js` and must be replaced before publishing.

Memorable moment: the couple's constellation lights up star by star from the kiss.

Unresolved: real story, programme and FAQ copy from the couple.

## Direction contract

THESIS: The couple's own constellation is the page's signature; the site refuses the generic wedding template (cream paper, serif monogram, card grid) and the "practical info buried under decoration" layout.

OWN-WORLD: La La Land night sky: page background runs from deep night (#08021d) at the top to dusk violet and a sunset pink-orange horizon at the footer. Star yellow (#ffe45e) for actions and key facts, off-white ink, lavender secondary text. Solid indigo panels with a faint star-yellow border, Alex Brush script headings, Lato body, polaroid photos, four-point sparkle stars.

STORY: A guest sees names, date and place at once, taps "Conferma la presenza", reads the programme with map and calendar, sends the RSVP, then scrolls the couple's story and photos, checks FAQ and the IBAN.

FIRST VIEWPORT: Constellation illustration centred in the top ~40% (mobile) / ~46% (desktop) of the viewport over a twinkling starfield; below it "Elia & Elena" in script, "Ci sposiamo il 14 maggio 2027 · Trebaseleghe (PD)", the four-unit countdown, then the primary yellow button "Conferma la presenza" and the ghost button "Programma e luogo", all above the fold on a 390×844 phone.

FORM: Extension of the incumbent La La Land world (not a new world); single long page, practical sections first, story timeline after. seed: none (pinned) — "Tienilo, rendilo migliore", "Prima le info pratiche", "Timeline con foto", "Un momento firma + resto sobrio".

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
