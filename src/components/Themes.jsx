import { THEMES } from '../data'
import { useReveal } from '../hooks'
import SectionHeading from './SectionHeading'

export default function Themes() {
  return (
    <section id="themes" className="bg-mist scroll-mt-24 py-24 sm:py-32">
      <div className="container-x">
        <SectionHeading
          eyebrow="産業テーマ"
          title="世界の産業テーマを、日本の構造から読み解く。"
          lead="公開情報に基づき、半導体、AI、防衛、エネルギーなどの世界的な産業テーマを、日本の企業・地域・産業構造と結びつけて整理します。"
        />

        <div className="mt-12 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {THEMES.map((name, i) => (
            <ThemeChip key={name} name={name} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ThemeChip({ name, index }) {
  const ref = useReveal()
  return (
    <div
      ref={ref}
      className="reveal group flex items-center rounded-lg border border-line bg-canvas px-4 py-3 transition-colors hover:border-accent/50 hover:bg-accent-wash/40"
      style={{ transitionDelay: `${Math.min(index, 12) * 35}ms` }}
    >
      <span className="font-display text-sm font-semibold text-ink transition-colors group-hover:text-accent">
        {name}
      </span>
    </div>
  )
}
