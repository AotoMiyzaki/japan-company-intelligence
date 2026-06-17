import { useEffect, useState } from 'react'
import { usePrefersReducedMotion, useIsMobile } from '../hooks'
import JapanMap from './JapanMap'

// ── フェーズ（マウントからの ms） ───────────────────────────────
// 主役は最初から「発光する日本列島」。
// 0: 列島の気配（淡い輪郭が暗闇に浮かぶ）
// 1: 光が差し込み、輪郭とノードが点灯（スイープ＋スキャン）
// 2: 各地域のビーコンが順番に立ち上がる＋周囲に流線・粒子
// 3: メインコピー  4: サブコピー  5: CTA
const TIMELINE = [500, 1500, 3100, 3900, 4700]

// 列島周囲を走る光粒（フィロタキシス配置で中心に密、外周に疎）
const PARTICLES = Array.from({ length: 34 }, (_, i) => {
  const a = i * 2.399963        // 黄金角
  const r = Math.sqrt((i + 0.5) / 34)
  const big = i % 5 === 0
  return {
    left: 50 + Math.cos(a) * r * 40,
    top: 40 + Math.sin(a) * r * 36,
    size: big ? 3 : 1.6,
    big,
    dur: 2.4 + (i % 7) * 0.45,
    delay: (i % 11) * 0.21,
  }
})

// 日本列島を内包する観測リング（連続した閉じた縦長楕円）。
// 列島が右肩上がりに伸びるため、やや右寄りの中心に置き、軌道全体を少しだけ
// 傾けて「ほんの少し日本に反応している」印象にする（形は崩さない）。
// 438×516 座標系。同心の楕円なので途切れない。
const ORBIT_RINGS = [
  { rx: 250, ry: 300, w: 1.1, op: 0.5,  dash: '5 9',  dur: 26 },
  { rx: 216, ry: 262, w: 0.7, op: 0.26, dash: '3 11', dur: 34 },
]
const ORBIT_CX = 235
const ORBIT_CY = 225
const ORBIT_TILT = 45   // 度。正値=時計回り=右上がり。楕円は対称なので
                        // 傾きが最も強く見えるのは45度（0/90度では傾いて見えない）

export default function Hero() {
  const reduced = usePrefersReducedMotion()
  const mobile = useIsMobile()
  const [phase, setPhase] = useState(0)
  const [settled, setSettled] = useState(false)

  useEffect(() => {
    if (reduced) { setPhase(5); setSettled(true); return }
    const timers = TIMELINE.map((t, i) => setTimeout(() => setPhase(i + 1), t))
    // FV演出が出揃った後、常時ループを落ち着かせる
    timers.push(setTimeout(() => setSettled(true), TIMELINE[TIMELINE.length - 1] + 3000))
    return () => timers.forEach(clearTimeout)
  }, [reduced])

  // モバイルは演出を軽量化し、出揃った後はループ系を停止する
  const lite = mobile
  const loopsOn = !reduced && !(mobile && settled)

  // 軽量モードの調整値
  const particles = lite ? PARTICLES.slice(0, 10) : PARTICLES
  const rings = lite ? ORBIT_RINGS.slice(0, 1) : ORBIT_RINGS

  const mapLit    = phase >= 1
  const beaconsOn = phase >= 2
  const flowOn    = phase >= 2
  const showMain  = phase >= 3
  const showSub   = phase >= 4
  const showCTA   = phase >= 5

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
      {/* 中央のアクセントグロー（列島を照らす光源） */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 64% 52% at 50% 40%, rgba(0,14,153,0.55), transparent 72%)',
          opacity: mapLit ? 1 : 0.4,
          transition: 'opacity 1.4s ease',
        }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 34% 26% at 50% 38%, rgba(91,141,239,0.28), transparent 70%)',
          opacity: mapLit ? 1 : 0,
          transition: 'opacity 1.6s ease',
        }}
        aria-hidden="true"
      />

      {/* ════════ シグナルマップ・ステージ ════════ */}
      <div className="absolute inset-0" aria-hidden="true">

        {/* 周囲の光粒 */}
        <div
          className="absolute inset-0"
          style={{ opacity: mapLit ? 1 : 0.35, transition: 'opacity 1.6s ease' }}
        >
          {particles.map((p, i) => (
            <span
              key={i}
              className="absolute rounded-full"
              style={{
                left: `${p.left}%`,
                top: `${p.top}%`,
                width: p.size,
                height: p.size,
                background: p.big ? '#C0DEFF' : '#7DB0FF',
                boxShadow: p.big
                  ? '0 0 8px 2px rgba(125,176,255,0.9), 0 0 16px 3px rgba(91,141,239,0.5)'
                  : '0 0 5px 1px rgba(125,176,255,0.7)',
                opacity: loopsOn ? undefined : 0.5,
                animation: loopsOn ? `twinkle ${p.dur}s ease-in-out ${p.delay}s infinite` : 'none',
              }}
            />
          ))}
        </div>

        {/* 列島本体＋オーバーレイ（中央配置） */}
        <div
          className="absolute top-[48%]"
          style={{
            left: mobile ? '44%' : '50%',
            width: 'min(460px, 76vw)',
            aspectRatio: '438 / 516',
            opacity: mapLit ? 1 : 0.35,
            transform: `translate(-50%, -50%) scale(${mapLit ? 1 : 0.95})`,
            filter: mapLit
              ? (lite
                  ? 'drop-shadow(0 0 16px rgba(91,141,239,0.5)) brightness(1.04)'
                  : 'drop-shadow(0 0 40px rgba(91,141,239,0.65)) drop-shadow(0 0 14px rgba(125,176,255,0.35)) brightness(1.05)')
              : 'drop-shadow(0 0 6px rgba(91,141,239,0.15)) brightness(0.28)',
            transition: 'opacity 1.5s ease, transform 1.5s cubic-bezier(0.16,1,0.3,1), filter 1.5s ease',
          }}
        >
          {/* 日本列島SVG（正確な47都道府県） */}
          <JapanMap
            variant="dark"
            className="h-full w-full"
            lit={mapLit}
            animateBeacons={!reduced && beaconsOn}
            lite={lite}
            pingLoop={loopsOn}
          />

          {/* 観測リング（日本列島を内包する連続した縦長楕円の点線軌道） */}
          <svg
            viewBox="0 0 438 516"
            className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
            style={{ opacity: flowOn ? 1 : 0, transition: 'opacity 1.2s ease' }}
          >
            <defs>
              <filter id="orbit-soft" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="1.4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <g transform={`rotate(${ORBIT_TILT} ${ORBIT_CX} ${ORBIT_CY})`}>
              {rings.map((ring, i) => (
                <ellipse
                  key={i}
                  cx={ORBIT_CX}
                  cy={ORBIT_CY}
                  rx={ring.rx}
                  ry={ring.ry}
                  fill="none"
                  stroke="#9FC4FF"
                  strokeWidth={ring.w}
                  strokeOpacity={ring.op}
                  strokeDasharray={ring.dash}
                  strokeLinecap="round"
                  filter={lite ? undefined : 'url(#orbit-soft)'}
                  style={{ animation: loopsOn ? `flow-dash ${ring.dur}s linear infinite` : 'none' }}
                />
              ))}
            </g>
          </svg>
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
