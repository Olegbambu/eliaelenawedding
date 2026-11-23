// A few small butterflies along the page edges, kept away from the content column.
const butterflies = [
  { top: '22%', left: '3%', size: 64, delay: '-2s', color: '#7ef7a3', duration: '15s' },
  { top: '48%', left: '97%', size: 56, delay: '-9s', color: '#ffa7d5', duration: '17s' },
  { top: '71%', left: '3%', size: 60, delay: '-5s', color: '#ffe65d', duration: '16s' },
  { top: '88%', left: '97%', size: 52, delay: '-12s', color: '#73eced', duration: '18s' },
]

export default function ButterflyBackground() {
  return (
    <div className="butterfly-backdrop" aria-hidden="true">
      {butterflies.map((butterfly, index) => (
        <svg
          key={index}
          viewBox="0 0 200 160"
          className="butterfly-backdrop__item"
          style={{
            top: butterfly.top,
            '--butterfly-x': butterfly.left,
            '--butterfly-size': `${butterfly.size}px`,
            animationDelay: butterfly.delay,
            animationDuration: butterfly.duration,
            '--butterfly-color': butterfly.color,
          }}
        >
          <defs>
            <linearGradient id={`butterfly-wing-${index}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fffaa0" />
              <stop offset="45%" stopColor="var(--butterfly-color)" />
              <stop offset="100%" stopColor="#ff79d1" />
            </linearGradient>
          </defs>
          <g className="butterfly-backdrop__wings">
            <path className="butterfly-backdrop__wing" fill={`url(#butterfly-wing-${index})`} d="M96 73C76 34 38 7 18 23-4 41 14 91 91 91zM94 83C59 63 20 70 26 106c5 31 41 38 69-8zM104 73c20-39 58-66 78-50 22 18 4 68-73 68zM106 83c35-20 74-13 68 23-5 31-41 38-69-8z" />
            <path className="butterfly-backdrop__veins" d="M98 77 24 29M96 82 15 54M94 86 34 98M99 86 48 119M102 77l74-48M104 82l81-28M106 86l60 12M101 86l51 33" />
            <path className="butterfly-backdrop__spots" d="M34 39c7-8 18-5 19 3-8 7-16 7-19-3zm-2 49c9-5 17-1 15 8-9 5-15 2-15-8zm134-49c-7-8-18-5-19 3 8 7 16 7 19-3zm2 49c-9-5-17-1-15 8 9 5 15 2 15-8z" />
          </g>
          <path className="butterfly-backdrop__body" d="M97 66c-5-15-14-21-21-19m27 19c5-15 14-21 21-19m-24 8v53l-5 10 5 5 5-5-5-10" />
        </svg>
      ))}
    </div>
  )
}
