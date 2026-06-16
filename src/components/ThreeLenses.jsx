import { LENSES } from '../data'
import { useReveal } from '../hooks'
import SectionHeading from './SectionHeading'

const ICONS = {
  company: (
    <path d="M4 20V8l8-4 8 4v12M4 20h16M9 20v-5h6v5M8 11h.01M12 11h.01M16 11h.01" />
  ),
  region: <path d="M12 21s-7-6.5-7-11a7 7 0 0 1 14 0c0 4.5-7 11-7 11Zm0-8.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />,
  theme:  <path d="M3 12h4l3 8 4-16 3 8h4" />,
}

export default function ThreeLenses() {
  return (
    <section id="lenses" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="container-x">
        <SectionHeading
          eyebrow="3つの視点"
          title="企業・地域・テーマで、日本を読む。"
          lead="同じ企業群を3つの切り口で見る。グローバルなテーマから現場の銘柄まで、仮説に応じて視点を切り替えながら深掘りできます。"
        />

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {LENSES.map((lens, i) => (
            <LensCard key={lens.key} lens={lens} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

function LensCard({ lens, index }) {
  const ref = useReveal()
  return (
    <div
      ref={ref}
      className="reveal panel-card flex flex-col p-7"
      style={{ transitionDelay: `${index * 120}ms` }}
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-accent/20 bg-accent/8 text-accent">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
        >
          {ICONS[lens.key]}
        </svg>
      </div>
      <h3 className="mt-5 font-display text-xl font-semibold text-ink">{lens.ja}</h3>
      <p className="mt-4 text-sm leading-relaxed text-ink-muted">{lens.desc}</p>
    </div>
  )
}
