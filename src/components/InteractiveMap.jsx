import { useState } from 'react'
import { REGIONS } from '../data'
import { useReveal } from '../hooks'
import JapanMap from './JapanMap'

export default function InteractiveMap() {
  const [selectedId, setSelectedId] = useState('hokkaido')
  const [hoverId, setHoverId] = useState(null)

  const activeId = hoverId || selectedId
  const region = REGIONS.find((r) => r.id === activeId) || REGIONS[0]

  const headingRef = useReveal()
  const bodyRef    = useReveal()

  return (
    <section id="explore" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="container-x">
        <div ref={headingRef} className="reveal max-w-2xl">
          <p className="eyebrow">探る</p>
          <h2 className="mt-4 font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
            8地域。ひとつの産業地図。
          </h2>
          <p className="mt-4 text-base leading-relaxed text-ink-muted sm:text-lg">
            地域をホバー・タップすると、主要な産業テーマ、調査対象企業数、現在の動向を確認できます。
          </p>
        </div>

        <div
          ref={bodyRef}
          className="reveal mt-14 grid items-center gap-10 lg:grid-cols-[1.1fr_1fr]"
        >
          {/* 地図 */}
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

          {/* 情報パネル */}
          <div className="panel-card p-7 sm:p-8">
            <div className="flex items-baseline justify-between gap-4">
              <div>
                <h3 className="font-display text-2xl font-bold text-ink">
                  {region.ja}
                </h3>
                <p className="text-sm text-ink-faint">{region.en}</p>
              </div>
              <div className="text-right">
                <p className="font-display text-3xl font-bold text-accent">
                  {region.companies}
                </p>
                <p className="text-[11px] uppercase tracking-[0.15em] text-ink-faint">
                  調査対象企業数
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {region.themes.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-accent/20 bg-accent/8 px-3 py-1 text-xs font-medium text-accent"
                >
                  {t}
                </span>
              ))}
            </div>

            <div className="mt-6 border-t border-line pt-5">
              <p className="text-[11px] uppercase tracking-[0.18em] text-ink-faint">
                現在のシグナル
              </p>
              <p className="mt-2 text-sm leading-relaxed text-ink">
                {region.signal}
              </p>
            </div>

            {/* 地域切替ボタン */}
            <div className="mt-6 flex flex-wrap gap-2">
              {REGIONS.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setSelectedId(r.id)}
                  onMouseEnter={() => setHoverId(r.id)}
                  onMouseLeave={() => setHoverId(null)}
                  className={`rounded-md px-2.5 py-1 text-xs transition-colors ${
                    activeId === r.id
                      ? 'bg-accent text-white'
                      : 'bg-mist text-ink-muted hover:bg-mist2'
                  }`}
                >
                  {r.ja}
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="mt-6 text-xs text-ink-faint">
          表示数値はプラットフォームの例示であり、投資助言ではありません。
        </p>
      </div>
    </section>
  )
}
