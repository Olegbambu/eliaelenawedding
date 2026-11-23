// Marks invented sample copy while developing. Never rendered in production builds.
export default function DraftBadge({ show }) {
  if (!import.meta.env.DEV || !show) return null
  return <span className="draft-badge" title="Testo segnaposto: sostituiscilo in src/content.js">bozza</span>
}
