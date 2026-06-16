import { useEffect, useState } from 'react'

const LINKS = [
  { href: '#layers',   label: '私たちが見ているもの' },
  { href: '#lenses',   label: '3つの視点' },
  { href: '#explore',  label: '探る' },
  { href: '#signal',   label: 'リサーチ' },
  { href: '#why',      label: 'なぜ今、日本か' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled ? 'border-b border-line bg-canvas/90 backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <nav className="container-x flex h-16 items-center justify-between">
        <a href="#top" className="flex items-center gap-2.5">
          <span className="inline-flex h-2.5 w-2.5 rounded-full bg-accent" />
          <span className="font-display text-sm font-semibold tracking-tight text-ink">
            Japan Company Intelligence
          </span>
        </a>

        <div className="hidden items-center gap-7 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-ink-muted transition-colors hover:text-accent"
            >
              {l.label}
            </a>
          ))}
        </div>

        <a
          href="#access"
          className="rounded-full border border-accent/40 px-4 py-1.5 text-sm font-medium text-accent transition-colors hover:bg-accent hover:text-white"
        >
          早期アクセス
        </a>
      </nav>
    </div>
  )
}
