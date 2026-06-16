import { LAYERS } from '../data'
import { useReveal } from '../hooks'
import SectionHeading from './SectionHeading'

export default function WhatWeSee() {
  return (
    <section id="layers" className="container-x scroll-mt-24 py-24 sm:py-32">
      <SectionHeading
        eyebrow="私たちが見ているもの"
        title="3つのレイヤーで、日本企業を丸ごと捉える。"
        lead="日本のカバレッジは大手上場企業で止まることが多い。私たちは3層の深さまで踏み込み、海外資本がほとんど届いていない市場の内側を映し出します。"
      />

      <div className="mt-14 grid gap-5 md:grid-cols-3">
        {LAYERS.map((layer, i) => (
          <LayerCard key={layer.ja} layer={layer} index={i} />
        ))}
      </div>
    </section>
  )
}

function LayerCard({ layer, index }) {
  const ref = useReveal()
  return (
    <div
      ref={ref}
      className="reveal panel-card group relative overflow-hidden p-7"
      style={{ transitionDelay: `${index * 120}ms` }}
    >
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-signal/10 blur-2xl transition-opacity duration-500 group-hover:bg-signal/20" />
      <p className="font-display text-xs uppercase tracking-[0.2em] text-signal-bright/70">
        {layer.tag}
      </p>
      <h3 className="mt-4 font-display text-2xl font-semibold text-ink">{layer.ja}</h3>
      <p className="mt-5 text-sm leading-relaxed text-ink-muted">{layer.desc}</p>
    </div>
  )
}
