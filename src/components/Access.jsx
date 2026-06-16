import { useState } from 'react'
import { useReveal } from '../hooks'

// 静的ホスティング（ロリポップFTP / Vercel static）はPOST処理不可のため、
// フォーム送信は mailto: で代替。実際のメールアドレスに差し替えるか、
// Formspree 等のサービス URL を action に設定してください。
const CONTACT_EMAIL = 'hello@example.com'

export default function Access() {
  const ref = useReveal()
  const [email, setEmail] = useState('')
  const [org,   setOrg]   = useState('')
  const [sent,  setSent]  = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    const subject = encodeURIComponent('早期アクセス申請 — Japan Company Intelligence')
    const body = encodeURIComponent(
      `メールアドレス: ${email}\n組織名: ${org}\n\nJapan Company Intelligence への早期アクセスを希望します。`,
    )
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`
    setSent(true)
  }

  return (
    <section id="access" className="container-x scroll-mt-24 pb-28 pt-12 sm:pb-36">
      <div
        ref={ref}
        className="reveal relative overflow-hidden rounded-3xl border border-signal/20 bg-gradient-to-br from-panel2 via-panel to-base p-8 text-center sm:p-14"
      >
        <div className="absolute inset-0 grid-overlay opacity-30" aria-hidden="true" />
        <div className="absolute left-1/2 top-0 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal/20 blur-3xl" />

        <div className="relative mx-auto max-w-xl">
          <p className="eyebrow justify-center">早期アクセス</p>
          <h2 className="mt-4 font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
            市場が見落としているシグナルを、<br className="hidden sm:block" />先に捉えてください。
          </h2>
          <p className="mt-4 text-base leading-relaxed text-ink-muted">
            限られたファンド・投資家の方に先行してアクセスを開放しています。
            ご関心のある方は、以下からご連絡ください。
          </p>

          {sent ? (
            <p className="mt-8 rounded-xl border border-signal/30 bg-signal/10 px-5 py-4 text-sm text-signal-bright">
              ありがとうございます。メールクライアントが開き、内容が入力された状態になります。
              確認次第ご連絡いたします。
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ご連絡先メールアドレス"
                className="flex-1 rounded-full border border-white/12 bg-base/60 px-5 py-3 text-sm text-ink placeholder:text-ink-faint outline-none transition-colors focus:border-signal/60"
              />
              <input
                type="text"
                value={org}
                onChange={(e) => setOrg(e.target.value)}
                placeholder="ファンド名 / 組織名"
                className="flex-1 rounded-full border border-white/12 bg-base/60 px-5 py-3 text-sm text-ink placeholder:text-ink-faint outline-none transition-colors focus:border-signal/60"
              />
              <button
                type="submit"
                className="rounded-full bg-signal px-7 py-3 text-sm font-semibold text-base transition-colors hover:bg-signal-bright"
              >
                申請する
              </button>
            </form>
          )}

          <p className="mt-5 text-xs text-ink-faint">
            スパムメールは送りません。リサーチ・アクセス情報のみお送りします。
          </p>
        </div>
      </div>
    </section>
  )
}
