import { useMemo } from 'react'
import { REGIONS } from '../data'

// Deterministic pseudo-random so the "data Japan" dot field is stable
// across renders without shipping a giant coordinate array.
function makeRng(seed) {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}

// Scatter a small cluster of faint dots around each region anchor so the
// archipelago reads as Japan without a literal coastline.
function useDotField() {
  return useMemo(() => {
    const rng = makeRng(20260616)
    const dots = []
    REGIONS.forEach((r, ri) => {
      const count = Math.max(8, Math.round(Math.sqrt(r.companies) * 1.6))
      for (let i = 0; i < count; i++) {
        const angle = rng() * Math.PI * 2
        const radius = Math.pow(rng(), 0.6) * 34
        dots.push({
          id: `${r.id}-${i}`,
          cx: r.x + Math.cos(angle) * radius,
          cy: r.y + Math.sin(angle) * radius * 0.85,
          r: 0.8 + rng() * 1.4,
          o: 0.12 + rng() * 0.3,
          delay: ri * 0.12 + rng() * 0.4,
        })
      }
    })
    return dots
  }, [])
}

/**
 * Shared stylized map of Japan used both in the hero and the interactive
 * explorer. Purely presentational — all state lives in the parent.
 *
 * Props:
 *  - lit: boolean | 'staggered' — whether region beacons are shown
 *  - animateBeacons: boolean — run the staggered light-up entrance
 *  - interactive: boolean — enable hover/click affordances
 *  - activeRegion: region id currently highlighted
 *  - onRegionEnter / onRegionLeave / onRegionSelect: callbacks(regionId)
 *  - showLabels: boolean
 */
export default function JapanMap({
  lit = true,
  animateBeacons = false,
  interactive = false,
  activeRegion = null,
  onRegionEnter,
  onRegionLeave,
  onRegionSelect,
  showLabels = false,
  className = '',
}) {
  const dots = useDotField()

  return (
    <svg
      viewBox="0 0 440 560"
      className={className}
      role="img"
      aria-label="Stylized map of Japan with eight regions"
    >
      <defs>
        <radialGradient id="beaconGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#7DD3FC" stopOpacity="0.9" />
          <stop offset="40%" stopColor="#38BDF8" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#38BDF8" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="beamGrad" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.0" />
          <stop offset="100%" stopColor="#7DD3FC" stopOpacity="0.7" />
        </linearGradient>
      </defs>

      {/* Faint connective lines along the archipelago */}
      <g stroke="rgba(56,189,248,0.16)" strokeWidth="0.8" fill="none">
        {REGIONS.slice(0, -1).map((r, i) => {
          const n = REGIONS[i + 1]
          return <line key={r.id} x1={r.x} y1={r.y} x2={n.x} y2={n.y} />
        })}
      </g>

      {/* Data-dot archipelago */}
      <g>
        {dots.map((d) => (
          <circle
            key={d.id}
            cx={d.cx}
            cy={d.cy}
            r={d.r}
            fill="#7DD3FC"
            opacity={d.o}
            style={
              animateBeacons
                ? {
                    animation: `fade-in 0.8s ease ${d.delay}s both`,
                  }
                : undefined
            }
          />
        ))}
      </g>

      {/* Region beacons */}
      {lit &&
        REGIONS.map((r, i) => {
          const isActive = activeRegion === r.id
          const beamStyle = animateBeacons
            ? { animation: `beacon 0.9s ease ${1.2 + i * 0.28}s both`, transformOrigin: `${r.x}px ${r.y}px` }
            : undefined
          const groupStyle = animateBeacons
            ? { animation: `fade-in 0.6s ease ${1.2 + i * 0.28}s both` }
            : undefined

          return (
            <g
              key={r.id}
              style={groupStyle}
              className={interactive ? 'cursor-pointer' : ''}
              onMouseEnter={interactive ? () => onRegionEnter?.(r.id) : undefined}
              onMouseLeave={interactive ? () => onRegionLeave?.(r.id) : undefined}
              onClick={interactive ? () => onRegionSelect?.(r.id) : undefined}
            >
              {/* Vertical beam of light */}
              <rect
                x={r.x - 1.1}
                y={r.y - 130}
                width="2.2"
                height="130"
                fill="url(#beamGrad)"
                opacity={isActive ? 0.95 : 0.55}
                style={beamStyle}
              />
              {/* Soft glow */}
              <circle
                cx={r.x}
                cy={r.y}
                r={isActive ? 26 : 18}
                fill="url(#beaconGlow)"
                className="transition-all duration-300"
              />
              {/* Expanding pulse ring */}
              <circle
                cx={r.x}
                cy={r.y}
                r="6"
                fill="none"
                stroke="#7DD3FC"
                strokeWidth="1"
                style={{
                  transformOrigin: `${r.x}px ${r.y}px`,
                  animation: 'pulse-ring 3s ease-out infinite',
                  animationDelay: `${i * 0.3}s`,
                  opacity: 0,
                }}
              />
              {/* Core */}
              <circle
                cx={r.x}
                cy={r.y}
                r={isActive ? 5 : 3.4}
                fill="#fff"
                className="transition-all duration-300"
                style={{ filter: 'drop-shadow(0 0 6px #7DD3FC)' }}
              />
              {/* Generous transparent hit area */}
              {interactive && (
                <circle cx={r.x} cy={r.y} r="30" fill="transparent" />
              )}

              {(showLabels || isActive) && (
                <text
                  x={r.x + 12}
                  y={r.y + 4}
                  fontSize="13"
                  fontFamily="Space Grotesk, sans-serif"
                  fill={isActive ? '#fff' : '#94A3B8'}
                  className="transition-colors duration-200 select-none"
                >
                  {r.en}
                </text>
              )}
            </g>
          )
        })}
    </svg>
  )
}
