import { THEMES } from '../data'
import { useReveal } from '../hooks'
import SectionHeading from './SectionHeading'

export default function Themes() {
  return (
    <section id="themes" className="bg-mist scroll-mt-24 py-24 sm:py-32">
      <div className="container-x">
        <SectionHeading
          eyebrow="代表テーマ"
          title="世界の投資テーマを、10の切り口で追う。"
          lead="グローバルな資金が向かうテーマごとに、日本の上場・未上場企業を横断して追跡します。"
        />

        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {THEMES.map((t, i) => (
            <ThemeChip key={t.ja} theme={t} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ThemeChip({ theme, index }) {
  const ref = useReveal()
  return (
    <div
      ref={ref}
      className="reveal group flex flex-col rounded-xl border border-line bg-canvas px-5 py-4 transition-colors hover:border-accent/50"
      style={{ transitionDelay: `${index * 50}ms` }}
    >
      <span className="font-display text-base font-semibold text-ink transition-colors group-hover:text-accent">
        {theme.ja}
      </span>
      <span className="mt-0.5 text-xs text-ink-faint">{theme.en}</span>
    </div>
  )
}
