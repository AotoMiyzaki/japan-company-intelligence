import { useReveal } from '../hooks'

export default function SectionHeading({ eyebrow, title, lead, align = 'left' }) {
  const ref = useReveal()
  const alignCls = align === 'center' ? 'mx-auto text-center items-center' : 'items-start'

  return (
    <div ref={ref} className={`reveal flex max-w-2xl flex-col ${alignCls}`}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 className="mt-4 font-display text-3xl font-700 leading-tight tracking-tight sm:text-4xl" style={{ textWrap: 'balance' }}>
        {title}
      </h2>
      {lead && <p className="mt-4 text-base leading-relaxed text-ink-muted sm:text-lg">{lead}</p>}
    </div>
  )
}
