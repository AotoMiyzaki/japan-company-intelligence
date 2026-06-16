import { useState } from 'react'
import { useReveal } from '../hooks'

// Static hosting (Lolipop FTP / Vercel static) cannot process a POST.
// Until a form backend (e.g. Formspree, Google Forms, a serverless endpoint)
// is wired up, the form composes a mailto so submissions still reach an inbox.
// Replace CONTACT_EMAIL with the real address, or swap in a form action URL.
const CONTACT_EMAIL = 'hello@example.com'

export default function Access() {
  const ref = useReveal()
  const [email, setEmail] = useState('')
  const [org, setOrg] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    const subject = encodeURIComponent('Early access request — Japan Company Intelligence')
    const body = encodeURIComponent(
      `Email: ${email}\nOrganization: ${org}\n\nI'd like early access to Japan Company Intelligence.`,
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
          <p className="eyebrow justify-center">Early access</p>
          <h2 className="mt-4 font-display text-3xl font-700 leading-tight tracking-tight sm:text-4xl">
            See the signals overseas investors miss.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-ink-muted">
            We're opening access to a limited group of funds and investors.
            Leave your details and we'll be in touch.
          </p>

          {sent ? (
            <p className="mt-8 rounded-xl border border-signal/30 bg-signal/10 px-5 py-4 text-sm text-signal-bright">
              Thanks — your email client should open with a pre-filled message.
              We'll follow up shortly.
            </p>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="mt-8 flex flex-col gap-3 sm:flex-row"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Work email"
                className="flex-1 rounded-full border border-white/12 bg-base/60 px-5 py-3 text-sm text-ink placeholder:text-ink-faint outline-none transition-colors focus:border-signal/60"
              />
              <input
                type="text"
                value={org}
                onChange={(e) => setOrg(e.target.value)}
                placeholder="Fund / firm"
                className="flex-1 rounded-full border border-white/12 bg-base/60 px-5 py-3 text-sm text-ink placeholder:text-ink-faint outline-none transition-colors focus:border-signal/60"
              />
              <button
                type="submit"
                className="rounded-full bg-signal px-7 py-3 text-sm font-600 text-base transition-colors hover:bg-signal-bright"
              >
                Request
              </button>
            </form>
          )}

          <p className="mt-5 text-xs text-ink-faint">
            No spam. Research and access updates only.
          </p>
        </div>
      </div>
    </section>
  )
}
