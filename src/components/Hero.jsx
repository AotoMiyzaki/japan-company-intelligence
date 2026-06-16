import { useEffect, useRef, useState } from 'react'
import { FV_THEMES } from '../data'
import { usePrefersReducedMotion } from '../hooks'
import JapanMap from './JapanMap'

// ── フェーズ ────────────────────────────────────────────────
// 0:静止 1:軌道回転 2:収束(エネルギー充電) 3:フラッシュ 4:列島出現
// 5:フラッシュ消去 6:メイン 7:サブ 8:CTA
const TIMELINE = [600, 3400, 4800, 5100, 5500, 6400, 7400, 8400]

const N = FV_THEMES.length
const ORBIT_SPEED = 0.22
const CONVERGE_MS = 750
const P = 12  // 軌道粒子数

// フラッシュリング設定（5段階）
const FLASH_RINGS = [
  { size: 140,  dur: 0.32, delay: 0,    border: '1.5px solid rgba(180,220,255,0.95)' },
  { size: 260,  dur: 0.42, delay: 0.06, border: '1px solid rgba(125,176,255,0.8)'   },
  { size: 400,  dur: 0.52, delay: 0.1,  border: '1px solid rgba(91,141,239,0.55)'   },
  { size: 560,  dur: 0.62, delay: 0.14, border: '0.8px solid rgba(60,100,220,0.35)' },
  { size: 720,  dur: 0.72, delay: 0.18, border: '0.6px solid rgba(42,60,214,0.2)'   },
]

// 散乱パーティクル設定（16方向）
const SCATTER = Array.from({ length: 16 }, (_, i) => ({
  angle: (i / 16) * 360,
  size: [4, 2, 3, 2][i % 4],
  dur:  [0.42, 0.52, 0.37, 0.48][i % 4],
  delay: (i % 5) * 0.016,
  bright: i % 4 === 0,
}))

export default function Hero() {
  const reduced = usePrefersReducedMotion()
  const [phase, setPhase] = useState(0)
  const [flashKey, setFlashKey] = useState(0)

  const stageRef      = useRef(null)
  const chipRefs      = useRef([])
  const particleRefs  = useRef([])
  const glowRef       = useRef(null)
  const dims          = useRef({ rx: 320, ry: 150 })
  const convergeStart = useRef(null)

  useEffect(() => {
    if (reduced) { setPhase(8); return }
    const timers = TIMELINE.map((t, i) => setTimeout(() => setPhase(i + 1), t))
    return () => timers.forEach(clearTimeout)
  }, [reduced])

  useEffect(() => {
    if (phase === 2) convergeStart.current = performance.now()
    if (phase === 3) setFlashKey((k) => k + 1)
  }, [phase])

  useEffect(() => {
    const update = () => {
      const el = stageRef.current
      if (!el) return
      dims.current = {
        rx: Math.min(el.clientWidth * 0.42, 430),
        ry: Math.min(el.clientHeight * 0.40, 190),
      }
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  useEffect(() => {
    if (reduced) return
    let raf
    const start = performance.now()
    const loop = (now) => {
      const t = (now - start) / 1000
      const { rx, ry } = dims.current

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
        // 収束中はスケールダウン＋グロー強化
        if (convergeStart.current != null) {
          const e = Math.min(1, (now - convergeStart.current) / CONVERGE_MS)
          el.style.filter = `brightness(${1 + e * 1.5})`
        } else {
          el.style.filter = ''
        }
      }

      // 軌道粒子（2速、少し内側の軌道）
      for (let i = 0; i < P; i++) {
        const el = particleRefs.current[i]
        if (!el) continue
        const base = (i / P) * Math.PI * 2 + Math.PI / P
        const theta = base + t * ORBIT_SPEED * 1.65
        const x = rx * 0.8 * Math.cos(theta) * factor
        const y = ry * 0.8 * Math.sin(theta) * factor
        el.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`
      }

      // 収束中の中心グロー強度
      if (glowRef.current && convergeStart.current != null) {
        const e = Math.min(1, (now - convergeStart.current) / CONVERGE_MS)
        glowRef.current.style.opacity = String(e * 0.9)
        glowRef.current.style.transform = `translate(-50%,-50%) scale(${0.4 + e * 1.4})`
      }

      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [reduced])

  const showOrbit  = phase >= 1
  const converging = phase >= 2
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
            'linear-gradient(to right, rgba(91,141,239,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(91,141,239,0.08) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 70% 55% at 50% 40%, rgba(0,14,153,0.5), transparent 72%)' }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 35% 28% at 50% 40%, rgba(91,141,239,0.22), transparent 70%)' }}
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
            <span className="absolute h-10 w-10 rounded-full" style={{ background: 'rgba(91,141,239,0.2)', animation: 'breathe 3.2s ease-in-out infinite' }} />
            <span className="h-3 w-3 rounded-full bg-[#7DB0FF]" style={{ boxShadow: '0 0 20px 5px rgba(125,176,255,0.7)' }} />
          </span>
        </div>

        {/* ── 軌道トラック（発光リング） ── */}
        <svg
          className="absolute inset-0 h-full w-full"
          style={{ opacity: showOrbit && !themesGone ? 1 : 0, transition: 'opacity 0.8s ease' }}
          preserveAspectRatio="none"
        >
          <defs>
            <filter id="orbit-glow" x="-10%" y="-50%" width="120%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="orbit-glow-inner" x="-12%" y="-55%" width="124%" height="210%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {/* 外側メインリング（発光） */}
          <ellipse
            cx="50%" cy="40%" rx="42%" ry="40%"
            fill="none" stroke="#5B8DEF" strokeOpacity="0.45" strokeWidth="1.2"
            strokeDasharray="8 5"
            filter="url(#orbit-glow)"
          />
          {/* 外側エッジ（細い、高コントラスト） */}
          <ellipse
            cx="50%" cy="40%" rx="42%" ry="40%"
            fill="none" stroke="#A8C8FF" strokeOpacity="0.18" strokeWidth="0.6"
            strokeDasharray="2 14"
          />
          {/* 内側リング */}
          <ellipse
            cx="50%" cy="40%" rx="24%" ry="22%"
            fill="none" stroke="#5B8DEF" strokeOpacity="0.25" strokeWidth="0.8"
            filter="url(#orbit-glow-inner)"
          />
        </svg>

        {/* ── 軌道粒子（rAF駆動、明るく多め） ── */}
        <div className="absolute left-1/2 top-[40%] h-0 w-0">
          {Array.from({ length: P }).map((_, i) => {
            const isBig = i % 3 === 0
            return (
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
                    width: isBig ? 4 : 2,
                    height: isBig ? 4 : 2,
                    borderRadius: '50%',
                    background: isBig ? '#C0DEFF' : '#7DB0FF',
                    boxShadow: isBig
                      ? '0 0 8px 2px rgba(125,176,255,1), 0 0 16px 3px rgba(91,141,239,0.6)'
                      : '0 0 5px 1px rgba(125,176,255,0.9)',
                    transform: 'translate(-50%,-50%)',
                    animation: `particle-pulse ${1.8 + (i * 0.22)}s ease-in-out infinite`,
                    animationDelay: `${i * 0.15}s`,
                  }}
                />
              </div>
            )
          })}
        </div>

        {/* ── テーマチップ ── */}
        <div className="absolute left-1/2 top-[40%] h-0 w-0">
          {FV_THEMES.map((ja, i) => (
            <div
              key={ja}
              ref={(el) => (chipRefs.current[i] = el)}
              className="absolute left-0 top-0 will-change-transform"
              style={{
                opacity: !showOrbit ? 0 : themesGone ? 0 : 1,
                transition: themesGone ? 'opacity 0.2s ease' : 'opacity 0.6s ease',
              }}
            >
              <div
                className="whitespace-nowrap rounded-full border border-[#5B8DEF]/70 bg-[#080F28]/90 px-3.5 py-1.5 backdrop-blur-sm"
                style={{
                  boxShadow:
                    '0 0 0 1px rgba(91,141,239,0.2), ' +
                    '0 0 12px 2px rgba(91,141,239,0.55), ' +
                    '0 0 32px rgba(91,141,239,0.25), ' +
                    'inset 0 0 16px rgba(91,141,239,0.08)',
                }}
              >
                <span className="font-display text-sm font-semibold tracking-wide text-[#D8ECFF]">{ja}</span>
              </div>
            </div>
          ))}
        </div>

        {/* ── 収束中エネルギー充電グロー ── */}
        <div
          ref={glowRef}
          className="absolute left-1/2 top-[40%] pointer-events-none"
          style={{
            width: 120, height: 120,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(160,210,255,0.9) 0%, rgba(91,141,239,0.6) 35%, rgba(0,14,153,0.2) 70%, transparent 100%)',
            opacity: 0,
            transform: 'translate(-50%,-50%) scale(0.4)',
            filter: 'blur(1px)',
            transition: 'none',
          }}
          aria-hidden="true"
        />

        {/* ════════ 中心フラッシュ（SF演出） ════════ */}
        {showFlash && !flashGone && (
          <div key={flashKey} className="pointer-events-none">

            {/* コア閃光（極めて明るい中心点） */}
            <div
              className="absolute left-1/2 top-[40%]"
              style={{
                width: 14, height: 14,
                borderRadius: '50%',
                background: 'rgba(235, 248, 255, 1)',
                boxShadow:
                  '0 0 0 2px rgba(200,230,255,0.9), ' +
                  '0 0 20px 5px rgba(125,176,255,1), ' +
                  '0 0 60px 15px rgba(91,141,239,0.7), ' +
                  '0 0 100px 25px rgba(0,14,153,0.4)',
                animation: 'flash-core 0.6s cubic-bezier(0.16,1,0.3,1) forwards',
              }}
            />

            {/* 拡張リング（5層） */}
            {FLASH_RINGS.map((ring, i) => (
              <div
                key={i}
                className="absolute left-1/2 top-[40%]"
                style={{
                  width: ring.size, height: ring.size,
                  borderRadius: '50%',
                  border: ring.border,
                  boxShadow: i < 2 ? `0 0 6px rgba(125,176,255,0.4)` : 'none',
                  animation: `flash-ring ${ring.dur}s cubic-bezier(0.05,0.7,0.4,1) ${ring.delay}s forwards`,
                }}
              />
            ))}

            {/* クロスヘア（垂直線） */}
            <div
              className="absolute left-1/2 top-[40%]"
              style={{
                width: 1.5, height: 300,
                background: 'linear-gradient(to bottom, transparent 0%, rgba(125,176,255,0.9) 50%, transparent 100%)',
                boxShadow: '0 0 6px rgba(125,176,255,0.5)',
                animation: 'crosshair-v 0.5s ease forwards',
              }}
            />
            {/* クロスヘア（水平線） */}
            <div
              className="absolute left-1/2 top-[40%]"
              style={{
                width: 300, height: 1.5,
                background: 'linear-gradient(to right, transparent 0%, rgba(125,176,255,0.9) 50%, transparent 100%)',
                boxShadow: '0 0 6px rgba(125,176,255,0.5)',
                animation: 'crosshair-h 0.5s ease forwards',
              }}
            />

            {/* 放射スパイク（SVG、8方向） */}
            <div
              className="absolute left-1/2 top-[40%]"
              style={{
                width: 200, height: 200,
                animation: 'flash-spike 0.5s ease forwards',
              }}
            >
              <svg
                style={{ position: 'absolute', left: '-50%', top: '-50%', width: '100%', height: '100%', overflow: 'visible' }}
                viewBox="-100 -100 200 200"
              >
                {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
                  const rad = (deg * Math.PI) / 180
                  const len = i % 2 === 0 ? 70 : 45
                  const w   = i % 2 === 0 ? 1.2 : 0.7
                  return (
                    <line
                      key={deg}
                      x1={Math.cos(rad) * 8}  y1={Math.sin(rad) * 8}
                      x2={Math.cos(rad) * len} y2={Math.sin(rad) * len}
                      stroke={i % 2 === 0 ? 'rgba(180,220,255,0.9)' : 'rgba(91,141,239,0.65)'}
                      strokeWidth={w}
                    />
                  )
                })}
              </svg>
            </div>

            {/* 散乱パーティクル（16方向） */}
            {SCATTER.map(({ angle, size, dur, delay, bright }, i) => (
              <div
                key={i}
                className="absolute left-1/2 top-[40%] pointer-events-none"
                style={{ transform: `rotate(${angle}deg)` }}
              >
                <div
                  style={{
                    position: 'absolute',
                    width: size, height: size,
                    top: -size / 2, left: -size / 2,
                    borderRadius: '50%',
                    background: bright ? '#C8E8FF' : '#5B8DEF',
                    boxShadow: bright
                      ? '0 0 7px 2px rgba(180,220,255,0.95)'
                      : '0 0 4px 1px rgba(91,141,239,0.8)',
                    animation: `scatter-p ${dur}s ease ${delay}s forwards`,
                  }}
                />
              </div>
            ))}
          </div>
        )}

        {/* ── 日本列島（スキャンライン付き起動演出） ── */}
        <div
          className="absolute left-1/2 top-[40%] -translate-x-1/2 -translate-y-1/2"
          style={{
            width: 'min(440px, 72vw)',
            aspectRatio: '438 / 516',
            opacity: showMap ? (mapDimmed ? 0.6 : 1) : 0,
            transform: `translate(-50%, -50%) scale(${showMap ? 1 : 0.82})`,
            transition: 'opacity 1.2s ease, transform 1s cubic-bezier(0.16,1,0.3,1)',
            filter:
              'drop-shadow(0 0 32px rgba(91,141,239,0.5)) ' +
              'drop-shadow(0 0 10px rgba(125,176,255,0.25))',
          }}
        >
          <JapanMap variant="dark" className="h-full w-full" lit={showMap} animateBeacons={!reduced && showMap} />
          {/* スキャンライン（起動時） */}
          {showMap && (
            <div
              key="scan"
              className="pointer-events-none absolute inset-0 overflow-hidden"
            >
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(to bottom, ' +
                    'transparent 0%, rgba(91,141,239,0.08) 45%, ' +
                    'rgba(125,176,255,0.45) 50%, rgba(91,141,239,0.08) 55%, transparent 100%)',
                  animation: 'map-scan 1.6s cubic-bezier(0.25,1,0.5,1) forwards',
                  top: '-100%',
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* ════════ コピーレイヤー ════════ */}
      <div className="relative flex min-h-[100svh] flex-col items-center justify-end px-6 pb-24 text-center sm:pb-32">
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[58%]"
          style={{
            background: 'linear-gradient(to top, #06091A 20%, rgba(6,9,26,0.9) 55%, transparent)',
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
              style={{ boxShadow: '0 0 28px rgba(42,60,214,0.6), 0 0 8px rgba(91,141,239,0.4)' }}
            >
              早期アクセスを申請
            </a>
            <a
              href="#explore"
              className="rounded-full border border-white/25 px-7 py-3 text-sm font-medium text-white transition-colors hover:border-[#7DB0FF] hover:text-[#7DB0FF]"
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
