import { SAMPLE_SIGNAL } from '../data'
import { useReveal } from '../hooks'

export default function SampleSignal() {
  const ref = useReveal()
  const s = SAMPLE_SIGNAL

  return (
    <section id="signal" className="container-x scroll-mt-24 py-24 sm:py-32">
      <div
        ref={ref}
        className="reveal relative overflow-hidden rounded-3xl border border-white/8 bg-gradient-to-br from-panel2 to-panel p-8 sm:p-12"
      >
        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-signal/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-gold/5 blur-3xl" />

        <div className="relative">
          <div className="flex flex-wrap items-center gap-3">
            <span className="eyebrow">{s.kicker}</span>
            <span className="text-ink-faint">·</span>
            <span className="text-xs font-medium text-signal-bright">{s.region}</span>
            <span className="text-ink-faint">·</span>
            <span className="text-xs font-medium text-gold">{s.theme}</span>
          </div>

          <h3 className="mt-5 max-w-3xl font-display text-2xl font-bold leading-snug text-ink sm:text-3xl">
            {s.title}
          </h3>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-muted">
            {s.summary}
          </p>

          <div className="mt-9 grid max-w-lg grid-cols-3 gap-6">
            {s.metrics.map((m) => (
              <div key={m.label}>
                <p className="font-display text-3xl font-bold signal-text">{m.value}</p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-ink-faint">
                  {m.label}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href="#access"
              className="rounded-full bg-signal px-6 py-2.5 text-sm font-semibold text-base transition-colors hover:bg-signal-bright"
            >
              シグナル全文を読む
            </a>
            <span className="text-xs text-ink-faint">
              ※ 例示目的で作成したサンプルです。
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
