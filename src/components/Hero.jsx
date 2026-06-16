import { useEffect, useState } from 'react'
import { THEMES } from '../data'
import { usePrefersReducedMotion } from '../hooks'
import JapanMap from './JapanMap'

// FV phase timeline (ms from mount):
//  0 themes orbit in -> 1 themes converge -> 2 map + beacons -> 3 copy
const TIMELINE = [200, 3200, 4600]

export default function Hero() {
  const reduced = usePrefersReducedMotion()
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    if (reduced) {
      setPhase(3) // jump straight to the resolved state
      return
    }
    const timers = TIMELINE.map((t, i) => setTimeout(() => setPhase(i + 1), t))
    return () => timers.forEach(clearTimeout)
  }, [reduced])

  const themesVisible = phase >= 1
  const converged = phase >= 2
  const mapVisible = phase >= 2
  const copyVisible = phase >= 3

  return (
    <header className="relative isolate overflow-hidden">
      <div className="absolute inset-0 grid-overlay opacity-40" aria-hidden="true" />
      <div
        className="absolute inset-0 bg-gradient-to-b from-base/0 via-base/0 to-base"
        aria-hidden="true"
      />

      <div className="container-x relative grid min-h-[100svh] grid-cols-1 items-center gap-8 py-24 lg:grid-cols-2 lg:gap-4">
        {/* ---- Left: copy ---- */}
        <div
          className={`order-2 transition-all duration-1000 lg:order-1 ${
            copyVisible ? 'opacity-100 translate-y-0' : 'translate-y-6 opacity-0'
          }`}
        >
          <p className="eyebrow">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-signal animate-breathe" />
            Japan Company Intelligence
          </p>

          <h1 className="mt-6 font-display text-4xl font-700 leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            Signals from Japan,
            <br />
            <span className="signal-text">before the market sees them.</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-muted sm:text-lg">
            A research platform that maps global investment themes —
            semiconductors, space, AI, defense — onto the companies and regions
            actually driving them across Japan. Listed, emerging, and hidden.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a
              href="#access"
              className="rounded-full bg-signal px-7 py-3 text-sm font-600 text-base transition-colors hover:bg-signal-bright"
            >
              Request early access
            </a>
            <a
              href="#explore"
              className="rounded-full border border-white/15 px-7 py-3 text-sm font-500 text-ink transition-colors hover:border-signal/60 hover:text-signal-bright"
            >
              Explore the map
            </a>
          </div>

          <p className="mt-8 text-xs uppercase tracking-[0.18em] text-ink-faint">
            Built for funds · institutional investors · family offices
          </p>
        </div>

        {/* ---- Right: the stage (themes -> Japan) ---- */}
        <div className="order-1 relative mx-auto aspect-square w-full max-w-[440px] lg:order-2">
          {/* Initial breathing seed point */}
          <div
            className={`absolute inset-0 flex items-center justify-center transition-opacity duration-700 ${
              phase === 0 ? 'opacity-100' : 'opacity-0'
            }`}
            aria-hidden="true"
          >
            <span className="h-3 w-3 rounded-full bg-signal-bright animate-breathe shadow-[0_0_30px_8px_rgba(125,211,252,0.5)]" />
          </div>

          {/* Orbiting theme words */}
          <div
            className={`absolute inset-0 transition-all duration-1000 ${
              themesVisible && !converged
                ? 'scale-100 opacity-100'
                : converged
                  ? 'scale-50 opacity-0'
                  : 'scale-75 opacity-0'
            }`}
            aria-hidden={!themesVisible}
          >
            <div
              className={`absolute inset-0 ${reduced ? '' : 'animate-orbit'}`}
              style={{ animationPlayState: converged ? 'paused' : 'running' }}
            >
              {THEMES.map((theme, i) => {
                const angle = (i / THEMES.length) * 2 * Math.PI
                const radius = 42 // % of half-size
                const x = 50 + Math.cos(angle) * radius
                const y = 50 + Math.sin(angle) * radius
                return (
                  <div
                    key={theme.en}
                    className="absolute -translate-x-1/2 -translate-y-1/2"
                    style={{
                      left: `${x}%`,
                      top: `${y}%`,
                      transitionDelay: `${i * 90}ms`,
                    }}
                  >
                    <div
                      className={`${reduced ? '' : 'animate-counter-orbit'}`}
                      style={{ animationPlayState: converged ? 'paused' : 'running' }}
                    >
                      <div className="whitespace-nowrap rounded-full border border-signal/25 bg-panel/60 px-3.5 py-1.5 text-center backdrop-blur-sm">
                        <span className="block font-display text-sm font-600 text-ink">
                          {theme.en}
                        </span>
                        <span className="block text-[10px] tracking-wide text-signal-bright/70">
                          {theme.ja}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Japan map resolves in */}
          <div
            className={`absolute inset-0 transition-all duration-1000 ${
              mapVisible ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
            }`}
          >
            <JapanMap
              className="h-full w-full"
              lit
              animateBeacons={!reduced && mapVisible}
              showLabels={false}
            />
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div
        className={`pointer-events-none absolute bottom-7 left-1/2 -translate-x-1/2 transition-opacity duration-1000 ${
          copyVisible ? 'opacity-100' : 'opacity-0'
        }`}
        aria-hidden="true"
      >
        <div className="flex flex-col items-center gap-2 text-ink-faint">
          <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
          <span className="h-8 w-px bg-gradient-to-b from-signal/60 to-transparent" />
        </div>
      </div>
    </header>
  )
}
