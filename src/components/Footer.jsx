export default function Footer() {
  return (
    <footer className="border-t border-white/8">
      <div className="container-x py-12">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-signal-bright" />
              <span className="font-display text-sm font-600 text-ink">
                Japan Company Intelligence
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-ink-muted">
              Signals from Japan — the intelligence layer for Japanese companies,
              read by company, region, and theme.
            </p>
          </div>

          <div className="text-sm text-ink-muted">
            <p className="font-500 text-ink">Languages</p>
            <div className="mt-3 flex gap-4">
              <span className="text-signal-bright">English</span>
              <span className="text-ink-faint">日本語 (coming soon)</span>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/8 pt-6">
          <p className="text-xs leading-relaxed text-ink-faint">
            For information purposes only. Nothing on this site constitutes
            investment advice, a recommendation, or an offer to buy or sell any
            security. Company figures shown are illustrative.
          </p>
          <p className="mt-4 text-xs text-ink-faint">
            © {new Date().getFullYear()} Japan Company Intelligence. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
