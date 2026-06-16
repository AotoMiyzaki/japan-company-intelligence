import { useEffect, useRef, useState } from 'react'
import { FV_THEMES } from '../data'
import { usePrefersReducedMotion } from '../hooks'
import JapanMap from './JapanMap'

// ── フェーズ（マウントからの ms） ───────────────────────────────
// 0: 静止  1: テーマが軌道上を回転  2: 収束(中心へ吸い込まれる)
// 3: 中心で青い発光（チップ消去）  4: 発光から列島出現・ビーコン点灯
// 5: 発光消去  6: メイン  7: サブ  8: CTA
const TIMELINE = [600, 3400, 4800, 5100, 5500, 6400, 7400, 8400]

const N = FV_THEMES.length
const ORBIT_SPEED = 0.22   // rad/s（ゆっくり）
const CONVERGE_MS = 750    // 中心へ吸い込まれる時間

export default function Hero() {
  const reduced = usePrefersReducedMotion()
  const [phase, setPhase] = useState(0)

  const stageRef = useRef(null)
  const chipRefs = useRef([])
  const dims = useRef({ rx: 320, ry: 150 })
  const convergeStart = useRef(null)

  // フェーズタイマー
  useEffect(() => {
    if (reduced) { setPhase(7); return }
    const timers = TIMELINE.map((t, i) => setTimeout(() => setPhase(i + 1), t))
    return () => timers.forEach(clearTimeout)
  }, [reduced])

  // 収束開始時刻を記録
  useEffect(() => {
    if (phase === 2) convergeStart.current = performance.now()
  }, [phase])

  // 楕円半径をステージサイズから算出（レスポンシブ）
  useEffect(() => {
    const update = () => {
      const el = stageRef.current
      if (!el) return
      const w = el.clientWidth
      const h = el.clientHeight
      dims.current = {
        rx: Math.min(w * 0.42, 430),
        ry: Math.min(h * 0.40, 190),
      }
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  // ── 軌道アニメーション（requestAnimationFrame + DOM直接更新） ──
  useEffect(() => {
    if (reduced) return
    let raf
    const start = performance.now()
    const loop = (now) => {
      const t = (now - start) / 1000
      const { rx, ry } = dims.current

      // 収束係数（収束開始後 CONVERGE_MS で 1→0 へ）
      let factor = 1
      if (convergeStart.current != null) {
        const e = (now - convergeStart.current) / CONVERGE_MS
        factor = Math.max(0, 1 - e)
      }

      for (let i = 0; i < N; i++) {
        const el = chipRefs.current[i]
        if (!el) continue
        const base = (i / N) * Math.PI * 2 - Math.PI / 2
        const theta = base + t * ORBIT_SPEED
        const x = rx * Math.cos(theta) * factor
        const y = ry * Math.sin(theta) * factor
        el.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [reduced])

  const showOrbit  = phase >= 1
  const converging = phase >= 2
  const showFlash  = phase >= 3
  const themesGone = phase >= 3
  const showMap    = phase >= 4
  const flashGone  = phase >= 5
  const mapDimmed  = phase >= 6
  const showMain   = phase >= 6
  const showSub    = phase >= 7
  const showCTA    = phase >= 8

  return (
    <header className="relative isolate min-h-[100svh] overflow-hidden bg-[#06091A] text-white">

      {/* データグリッド背景 */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(91,141,239,0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(91,141,239,0.07) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
        aria-hidden="true"
      />
      {/* 中央のアクセントグロー */}
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 70% 55% at 50% 40%, rgba(0,14,153,0.45), transparent 72%)' }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 40% 30% at 50% 40%, rgba(91,141,239,0.18), transparent 70%)' }}
        aria-hidden="true"
      />

      {/* ════════ アニメーション・ステージ ════════ */}
      <div ref={stageRef} className="absolute inset-0" aria-hidden="true">

        {/* 静かな起点（phase 0） */}
        <div
          className="absolute left-1/2 top-[40%] -translate-x-1/2 -translate-y-1/2"
          style={{ opacity: phase === 0 ? 1 : 0, transition: 'opacity 0.6s ease' }}
        >
          <span className="relative flex h-4 w-4 items-center justify-center">
            <span className="absolute h-8 w-8 rounded-full" style={{ background: 'rgba(125,176,255,0.25)', animation: 'breathe 3.2s ease-in-out infinite' }} />
            <span className="h-2.5 w-2.5 rounded-full bg-[#7DB0FF]" style={{ boxShadow: '0 0 16px 4px rgba(125,176,255,0.6)' }} />
          </span>
        </div>

        {/* 軌道トラック（楕円リング） */}
        <svg
          className="absolute inset-0 h-full w-full"
          style={{ opacity: showOrbit && !themesGone ? 1 : 0, transition: 'opacity 0.8s ease' }}
          preserveAspectRatio="none"
        >
          <ellipse cx="50%" cy="40%" rx="42%" ry="40%" fill="none" stroke="#5B8DEF" strokeOpacity="0.16" strokeWidth="1" strokeDasharray="6 6" />
          <ellipse cx="50%" cy="40%" rx="24%" ry="22%" fill="none" stroke="#5B8DEF" strokeOpacity="0.08" strokeWidth="1" />
        </svg>

        {/* テーマチップ（軌道上を回転） */}
        <div className="absolute left-1/2 top-[40%] h-0 w-0">
          {FV_THEMES.map((ja, i) => (
            <div
              key={ja}
              ref={(el) => (chipRefs.current[i] = el)}
              className="absolute left-0 top-0 will-change-transform"
              style={{
                opacity: !showOrbit ? 0 : themesGone ? 0 : 1,
                transition: 'opacity 0.6s ease',
              }}
            >
              <div className="whitespace-nowrap rounded-full border border-[#5B8DEF]/40 bg-[#0C1430]/80 px-3.5 py-1.5 backdrop-blur-sm shadow-[0_0_18px_rgba(0,14,153,0.4)]">
                <span className="font-display text-sm font-semibold text-[#CFE0FF]">{ja}</span>
              </div>
            </div>
          ))}
        </div>

        {/* 中心フラッシュ（収束完了時の青い発光） */}
        <div
          className="absolute left-1/2 top-[40%] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{
            width: showFlash && !flashGone ? (showMap ? '280px' : '120px') : '0px',
            height: showFlash && !flashGone ? (showMap ? '280px' : '120px') : '0px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(125,176,255,0.9) 0%, rgba(91,141,239,0.5) 30%, rgba(42,60,214,0.2) 65%, transparent 100%)',
            opacity: showFlash && !flashGone ? 1 : 0,
            transition: showFlash
              ? flashGone
                ? 'opacity 0.6s ease, width 0.6s ease, height 0.6s ease'
                : 'opacity 0.25s ease, width 0.4s cubic-bezier(0.16,1,0.3,1), height 0.4s cubic-bezier(0.16,1,0.3,1)'
              : 'none',
            filter: 'blur(2px)',
          }}
          aria-hidden="true"
        />

        {/* 日本列島（ダーク版） */}
        <div
          className="absolute left-1/2 top-[40%] -translate-x-1/2 -translate-y-1/2"
          style={{
            width: 'min(440px, 72vw)',
            aspectRatio: '438 / 516',
            opacity: showMap ? (mapDimmed ? 0.5 : 1) : 0,
            transform: `translate(-50%, -50%) scale(${showMap ? 1 : 0.86})`,
            transition: 'opacity 1.3s ease, transform 1.1s cubic-bezier(0.16,1,0.3,1)',
            filter: 'drop-shadow(0 0 24px rgba(91,141,239,0.25))',
          }}
        >
          <JapanMap variant="dark" className="h-full w-full" lit={showMap} animateBeacons={!reduced && showMap} />
        </div>
      </div>

      {/* ════════ コピーレイヤー ════════ */}
      <div className="relative flex min-h-[100svh] flex-col items-center justify-end px-6 pb-24 text-center sm:pb-32">
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[56%]"
          style={{
            background: 'linear-gradient(to top, #06091A 18%, rgba(6,9,26,0.85) 55%, transparent)',
            opacity: showMain ? 1 : 0, transition: 'opacity 1.2s ease',
          }}
          aria-hidden="true"
        />

        <div className="relative z-10 w-full max-w-3xl">
          <p
            className="inline-flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#7DB0FF]"
            style={fade(showMain, 0)}
          >
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#7DB0FF]" style={{ animation: 'breathe 3.5s ease-in-out infinite' }} />
            Japan Company Intelligence
          </p>

          <h1
            className="mt-5 font-display text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-[3.4rem]"
            style={fade(showMain, 0.08)}
          >
            日本の産業シグナルを、
            <br />
            <span className="text-[#7DB0FF]">市場が気づく前に。</span>
          </h1>

          <p
            className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-[#AEBBD6] sm:text-lg"
            style={fade(showSub, 0)}
          >
            半導体、宇宙、AI、防衛などの世界的な投資テーマを、
            <br className="hidden sm:block" />
            日本各地の企業・地域・産業構造と結びつけて読み解くリサーチプラットフォーム。
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4" style={fade(showCTA, 0)}>
            <a
              href="#access"
              className="rounded-full bg-[#2A3CD6] px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#3D50E8]"
              style={{ boxShadow: '0 0 24px rgba(42,60,214,0.5)' }}
            >
              早期アクセスを申請
            </a>
            <a
              href="#explore"
              className="rounded-full border border-white/20 px-7 py-3 text-sm font-medium text-white transition-colors hover:border-[#7DB0FF] hover:text-[#7DB0FF]"
            >
              マップを見る
            </a>
          </div>
        </div>
      </div>

      {/* スクロール誘導 */}
      <div
        className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2"
        style={{ opacity: showCTA ? 0.6 : 0, transition: 'opacity 1.1s ease' }}
        aria-hidden="true"
      >
        <div className="flex flex-col items-center gap-2 text-[#6E7EA6]">
          <span className="text-[9px] uppercase tracking-[0.32em]">スクロール</span>
          <span className="h-7 w-px bg-gradient-to-b from-[#5B8DEF]/60 to-transparent" />
        </div>
      </div>
    </header>
  )
}

function fade(visible, delay = 0) {
  return {
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(16px)',
    transition: `opacity 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
  }
}
