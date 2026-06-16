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
          <span className={`inline-flex h-2.5 w-2.5 rounded-full transition-colors duration-300 ${scrolled ? 'bg-accent' : 'bg-[#7DB0FF]'}`} />
          <span className={`font-display text-sm font-semibold tracking-tight transition-colors duration-300 ${scrolled ? 'text-ink' : 'text-white'}`}>
            Japan Company Intelligence
          </span>
        </a>

        <div className="hidden items-center gap-7 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={`text-sm transition-colors duration-300 ${scrolled ? 'text-ink-muted hover:text-accent' : 'text-white/70 hover:text-white'}`}
            >
              {l.label}
            </a>
          ))}
        </div>

        <a
          href="#access"
          className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors duration-300 ${
            scrolled
              ? 'border-accent/40 text-accent hover:bg-accent hover:text-white'
              : 'border-white/30 text-white hover:border-white hover:bg-white/10'
          }`}
        >
          早期アクセス
        </a>
      </nav>
    </div>
  )
}
