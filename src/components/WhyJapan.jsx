import { AUDIENCES, WHY_JAPAN } from '../data'
import { useReveal } from '../hooks'
import SectionHeading from './SectionHeading'

export default function WhyJapan() {
  return (
    <section id="why" className="container-x scroll-mt-24 py-24 sm:py-32">
      <SectionHeading
        eyebrow="なぜ今、日本か"
        title={<>日本市場を見る視点が、<span className="inline-block">いま変わり始めている。</span></>}
        lead="資産運用改革、NISA拡充、ガバナンス改革、円安、事業承継が同時に進み、日本企業を見る視点が変わりつつあります。私たちは、その変化を公開情報に基づいて整理します。"
      />

      <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
        {WHY_JAPAN.map((item, i) => (
          <Reason key={item.ja} item={item} index={i} />
        ))}
      </div>

      {/* 対象読者 */}
      <div id="audience" className="mt-20 scroll-mt-24">
        <h3 className="font-display text-xl font-semibold text-ink">ご利用者</h3>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {AUDIENCES.map((a, i) => (
            <Audience key={a.ja} item={a} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

function Reason({ item, index }) {
  const ref = useReveal()
  return (
    <div ref={ref} className="reveal bg-canvas p-7" style={{ transitionDelay: `${index * 90}ms` }}>
      <p className="font-display text-lg font-semibold text-accent">0{index + 1}</p>
      <h4 className="mt-3 font-display text-lg font-semibold text-ink">{item.ja}</h4>
      <p className="mt-3 text-sm leading-relaxed text-ink-muted">{item.desc}</p>
    </div>
  )
}

function Audience({ item, index }) {
  const ref = useReveal()
  return (
    <div
      ref={ref}
      className="reveal panel-card p-6"
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <h4 className="font-display text-base font-semibold text-ink">{item.ja}</h4>
      <p className="mt-2 text-sm leading-relaxed text-ink-muted">{item.desc}</p>
    </div>
  )
}
