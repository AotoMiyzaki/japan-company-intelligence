export default function Footer() {
  return (
    <footer className="border-t border-white/8">
      <div className="container-x py-12">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-signal-bright" />
              <span className="font-display text-sm font-semibold text-ink">
                Japan Company Intelligence
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-ink-muted">
              日本の産業シグナルを、市場が気づく前に——
              企業・地域・テーマの3軸で読み解くリサーチ基盤。
            </p>
          </div>

          <div className="text-sm text-ink-muted">
            <p className="font-medium text-ink">言語</p>
            <div className="mt-3 flex gap-4">
              <span className="text-signal-bright">日本語</span>
              <span className="text-ink-faint">English (coming soon)</span>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/8 pt-6">
          <p className="text-xs leading-relaxed text-ink-faint">
            本サイトの情報は参考目的のみであり、投資助言・有価証券の勧誘・購入推奨ではありません。
            掲載する企業数・シグナル等の数値はプラットフォームの例示です。
            投資判断はご自身の責任のもとで行ってください。
          </p>
          <p className="mt-4 text-xs text-ink-faint">
            © {new Date().getFullYear()} Japan Company Intelligence. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
