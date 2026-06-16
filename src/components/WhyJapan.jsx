import { AUDIENCES, WHY_JAPAN } from '../data'
import { useReveal } from '../hooks'
import SectionHeading from './SectionHeading'

export default function WhyJapan() {
  return (
    <section id="why" className="container-x scroll-mt-24 py-24 sm:py-32">
      <SectionHeading
        eyebrow="Why Japan, why now"
        title="A market re-rating that overseas capital is still early to."
        lead="Four structural shifts are converging at once — and most of the opportunity sits below the surface of the headline index."
      />

      <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-white/8 bg-white/8 sm:grid-cols-2">
        {WHY_JAPAN.map((item, i) => (
          <Reason key={item.en} item={item} index={i} />
        ))}
      </div>

      {/* Who it's for */}
      <div id="audience" className="mt-20 scroll-mt-24">
        <h3 className="font-display text-xl font-600 text-ink">Who it's for</h3>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {AUDIENCES.map((a, i) => (
            <Audience key={a.en} item={a} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

function Reason({ item, index }) {
  const ref = useReveal()
  return (
    <div ref={ref} className="reveal bg-base p-7" style={{ transitionDelay: `${index * 90}ms` }}>
      <p className="font-display text-lg font-600 text-signal-bright">
        0{index + 1}
      </p>
      <h4 className="mt-3 font-display text-lg font-600 text-ink">{item.en}</h4>
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
      <h4 className="font-display text-base font-600 text-ink">{item.en}</h4>
      <p className="mt-2 text-sm leading-relaxed text-ink-muted">{item.desc}</p>
    </div>
  )
}
