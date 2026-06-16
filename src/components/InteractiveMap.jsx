import { useState } from 'react'
import { REGIONS } from '../data'
import { useReveal } from '../hooks'
import JapanMap from './JapanMap'

export default function InteractiveMap() {
  const [selectedId, setSelectedId] = useState('kyushu')
  const [hoverId, setHoverId] = useState(null)

  const activeId = hoverId || selectedId
  const region = REGIONS.find((r) => r.id === activeId) || REGIONS[0]

  const headingRef = useReveal()
  const bodyRef = useReveal()

  return (
    <section id="explore" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="container-x">
        <div ref={headingRef} className="reveal max-w-2xl">
          <p className="eyebrow">Explore</p>
          <h2 className="mt-4 font-display text-3xl font-700 leading-tight tracking-tight sm:text-4xl">
            Eight regions. One industrial map.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-ink-muted sm:text-lg">
            Hover or tap a region to see what is moving on the ground — the
            themes in play, the companies we track, and a live read on the
            signal.
          </p>
        </div>

        <div
          ref={bodyRef}
          className="reveal mt-14 grid items-center gap-10 lg:grid-cols-[1.1fr_1fr]"
        >
          {/* Map */}
          <div className="relative mx-auto w-full max-w-[460px]">
            <JapanMap
              className="h-full w-full"
              lit
              interactive
              activeRegion={activeId}
              showLabels
              onRegionEnter={setHoverId}
              onRegionLeave={() => setHoverId(null)}
              onRegionSelect={setSelectedId}
            />
          </div>

          {/* Read-out panel */}
          <div className="panel-card p-7 sm:p-8">
            <div className="flex items-baseline justify-between gap-4">
              <div>
                <h3 className="font-display text-2xl font-700 text-ink">
                  {region.en}
                </h3>
                <p className="text-sm text-ink-faint">{region.ja}</p>
              </div>
              <div className="text-right">
                <p className="font-display text-3xl font-700 signal-text">
                  {region.companies}
                </p>
                <p className="text-[11px] uppercase tracking-[0.15em] text-ink-faint">
                  companies tracked
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {region.themes.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-signal/25 bg-signal/10 px-3 py-1 text-xs font-500 text-signal-bright"
                >
                  {t}
                </span>
              ))}
            </div>

            <div className="mt-6 border-t border-white/8 pt-5">
              <p className="text-[11px] uppercase tracking-[0.18em] text-ink-faint">
                Current signal
              </p>
              <p className="mt-2 text-sm leading-relaxed text-ink">
                {region.signal}
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {REGIONS.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setSelectedId(r.id)}
                  onMouseEnter={() => setHoverId(r.id)}
                  onMouseLeave={() => setHoverId(null)}
                  className={`rounded-md px-2.5 py-1 text-xs transition-colors ${
                    activeId === r.id
                      ? 'bg-signal text-base'
                      : 'bg-white/5 text-ink-muted hover:bg-white/10'
                  }`}
                >
                  {r.en}
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="mt-6 text-xs text-ink-faint">
          Figures are illustrative of the platform and not investment advice.
        </p>
      </div>
    </section>
  )
}
