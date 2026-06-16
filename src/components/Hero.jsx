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
const ORBIT_SPEED = 0.22     // rad/s
const CONVERGE_MS = 750      // 中心へ吸い込まれる時間
const P = 7                  // 軌道粒子数

// 8方向のフラッシュスパイク角度
const SPIKE_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315]

export default function Hero() {
  const reduced = usePrefersReducedMotion()
  const [phase, setPhase] = useState(0)
  const [flashKey, setFlashKey] = useState(0)  // フラッシュ再トリガー用

  const stageRef      = useRef(null)
  const chipRefs      = useRef([])
  const particleRefs  = useRef([])
  const dims          = useRef({ rx: 320, ry: 150 })
  const convergeStart = useRef(null)

  // フェーズタイマー
  useEffect(() => {
    if (reduced) { setPhase(8); return }
    const timers = TIMELINE.map((t, i) => setTimeout(() => setPhase(i + 1), t))
    return () => timers.forEach(clearTimeout)
  }, [reduced])

  // 収束開始時刻を記録 + フラッシュキー更新
  useEffect(() => {
    if (phase === 2) convergeStart.current = performance.now()
    if (phase === 3) setFlashKey((k) => k + 1)
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

      // テーマチップ
      for (let i = 0; i < N; i++) {
        const el = chipRefs.current[i]
        if (!el) continue
        const base = (i / N) * Math.PI * 2 - Math.PI / 2
        const theta = base + t * ORBIT_SPEED
        const x = rx * Math.cos(theta) * factor
        const y = ry * Math.sin(theta) * factor
        el.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`
      }

      // 軌道粒子（チップより小さな軌道を少し速く周回）
      for (let i = 0; i < P; i++) {
        const el = particleRefs.current[i]
        if (!el) continue
        const base = (i / P) * Math.PI * 2 + Math.PI / P
        const theta = base + t * ORBIT_SPEED * 1.55
        const x = rx * 0.84 * Math.cos(theta) * factor
        const y = ry * 0.84 * Math.sin(theta) * factor
        el.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`
      }

      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [reduced])

  const showOrbit  = phase >= 1
  const themesGone = phase >= 3
  const showFlash  = phase >= 3
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

        {/* 軌道トラック（発光楕円リング） */}
        <svg
          className="absolute inset-0 h-full w-full"
          style={{ opacity: showOrbit && !themesGone ? 1 : 0, transition: 'opacity 0.8s ease' }}
          preserveAspectRatio="none"
        >
          <defs>
            <filter id="orbit-glow" x="-8%" y="-40%" width="116%" height="180%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {/* 外側メインリング */}
          <ellipse
            cx="50%" cy="40%" rx="42%" ry="40%"
            fill="none" stroke="#5B8DEF" strokeOpacity="0.28" strokeWidth="1"
            strokeDasharray="6 6"
            filter="url(#orbit-glow)"
          />
          {/* 内側リング */}
          <ellipse
            cx="50%" cy="40%" rx="24%" ry="22%"
            fill="none" stroke="#5B8DEF" strokeOpacity="0.12" strokeWidth="0.8"
          />
        </svg>

        {/* 軌道粒子 */}
        <div className="absolute left-1/2 top-[40%] h-0 w-0">
          {Array.from({ length: P }).map((_, i) => (
            <div
              key={i}
              ref={(el) => (particleRefs.current[i] = el)}
              className="absolute left-0 top-0 will-change-transform"
              style={{
                opacity: showOrbit && !themesGone ? 1 : 0,
                transition: 'opacity 0.5s ease',
              }}
            >
              <div
                style={{
                  width: i % 2 === 0 ? 3 : 2,
                  height: i % 2 === 0 ? 3 : 2,
                  borderRadius: '50%',
                  background: '#A8C8FF',
                  boxShadow: '0 0 5px 1px rgba(125,176,255,0.9)',
                  transform: 'translate(-50%,-50%)',
                  animation: `particle-pulse ${2.2 + (i * 0.31)}s ease-in-out infinite`,
                  animationDelay: `${i * 0.28}s`,
                }}
              />
            </div>
          ))}
        </div>

        {/* テーマチップ（軌道上を回転） */}
        <div className="absolute left-1/2 top-[40%] h-0 w-0">
          {FV_THEMES.map((ja, i) => (
            <div
              key={ja}
              ref={(el) => (chipRefs.current[i] = el)}
              className="absolute left-0 top-0 will-change-transform"
              style={{
                opacity: !showOrbit ? 0 : themesGone ? 0 : 1,
                transition: themesGone ? 'opacity 0.25s ease' : 'opacity 0.6s ease',
              }}
            >
              <div
                className="whitespace-nowrap rounded-full border border-[#5B8DEF]/60 bg-[#0C1430]/85 px-3.5 py-1.5 backdrop-blur-sm"
                style={{
                  boxShadow: '0 0 10px 1px rgba(91,141,239,0.45), 0 0 28px rgba(91,141,239,0.18), inset 0 0 12px rgba(91,141,239,0.06)',
                }}
              >
                <span className="font-display text-sm font-semibold text-[#CFE0FF]">{ja}</span>
              </div>
            </div>
          ))}
        </div>

        {/* ── 中心フラッシュ（シャープ・知的な発光） ── */}
        {showFlash && !flashGone && (
          <div key={flashKey} className="pointer-events-none">
            {/* コア閃光 */}
            <div
              className="absolute left-1/2 top-[40%]"
              style={{
                width: 10, height: 10,
                borderRadius: '50%',
                background: 'rgba(210,228,255,1)',
                boxShadow: '0 0 12px 3px rgba(125,176,255,1), 0 0 32px 6px rgba(91,141,239,0.7)',
                animation: 'flash-core 0.55s cubic-bezier(0.16,1,0.3,1) forwards',
              }}
            />
            {/* リング1（鋭い細いリング） */}
            <div
              className="absolute left-1/2 top-[40%]"
              style={{
                width: 220, height: 220,
                borderRadius: '50%',
                border: '1.2px solid rgba(125,176,255,0.9)',
                animation: 'flash-ring 0.48s cubic-bezier(0.1,0.6,0.4,1) forwards',
              }}
            />
            {/* リング2（遅延・広め） */}
            <div
              className="absolute left-1/2 top-[40%]"
              style={{
                width: 360, height: 360,
                borderRadius: '50%',
                border: '0.8px solid rgba(91,141,239,0.55)',
                animation: 'flash-ring2 0.6s cubic-bezier(0.1,0.6,0.4,1) 0.07s forwards',
              }}
            />
            {/* 放射スパイク（SVG） */}
            <div
              className="absolute left-1/2 top-[40%]"
              style={{
                width: 160, height: 160,
                animation: 'flash-spike 0.45s ease forwards',
              }}
            >
              <svg
                style={{ position: 'absolute', left: '-50%', top: '-50%', width: '100%', height: '100%' }}
                viewBox="-80 -80 160 160"
              >
                {SPIKE_ANGLES.map((deg, i) => {
                  const rad = (deg * Math.PI) / 180
                  const len = i % 2 === 0 ? 52 : 34
                  return (
                    <line
                      key={deg}
                      x1={Math.cos(rad) * 6}
                      y1={Math.sin(rad) * 6}
                      x2={Math.cos(rad) * len}
                      y2={Math.sin(rad) * len}
                      stroke="rgba(125,176,255,0.75)"
                      strokeWidth={i % 2 === 0 ? 0.9 : 0.6}
                    />
                  )
                })}
              </svg>
            </div>
          </div>
        )}

        {/* 日本列島（ダーク版） */}
        <div
          className="absolute left-1/2 top-[40%] -translate-x-1/2 -translate-y-1/2"
          style={{
            width: 'min(440px, 72vw)',
            aspectRatio: '438 / 516',
            opacity: showMap ? (mapDimmed ? 0.55 : 1) : 0,
            transform: `translate(-50%, -50%) scale(${showMap ? 1 : 0.86})`,
            transition: 'opacity 1.3s ease, transform 1.1s cubic-bezier(0.16,1,0.3,1)',
            filter: 'drop-shadow(0 0 28px rgba(91,141,239,0.38)) drop-shadow(0 0 8px rgba(125,176,255,0.18))',
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
