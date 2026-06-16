import { useEffect, useState } from 'react'
import { FV_THEMES } from '../data'
import { usePrefersReducedMotion } from '../hooks'
import JapanMap from './JapanMap'

// FVで散らす8テーマの初期配置（ビューポート % 座標）。中央のマップを囲む形。
const SCATTER = [
  { ja: FV_THEMES[0], x: 16, y: 20 },  // 半導体
  { ja: FV_THEMES[1], x: 50, y: 13 },  // AI
  { ja: FV_THEMES[2], x: 84, y: 20 },  // 防衛
  { ja: FV_THEMES[3], x: 88, y: 52 },  // 宇宙
  { ja: FV_THEMES[4], x: 84, y: 82 },  // エネルギー
  { ja: FV_THEMES[5], x: 50, y: 88 },  // 蓄電池
  { ja: FV_THEMES[6], x: 16, y: 82 },  // ロボティクス
  { ja: FV_THEMES[7], x: 12, y: 52 },  // 金融
]

// フェーズ（マウントからの ms）
// 0: 静かな起点  1: テーマ散布  2: 中央へ収束  3: マップ出現・ノード点灯
// 4: テーマ消去  5: メインコピー  6: サブコピー  7: CTA
const TIMELINE = [600, 2600, 4200, 5600, 6800, 7900, 8900]
const MAP_TOP = 40

export default function Hero() {
  const reduced = usePrefersReducedMotion()
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    if (reduced) { setPhase(7); return }
    const timers = TIMELINE.map((t, i) => setTimeout(() => setPhase(i + 1), t))
    return () => timers.forEach(clearTimeout)
  }, [reduced])

  const showThemes = phase >= 1
  const converging = phase >= 2
  const showMap    = phase >= 3
  const themesGone = phase >= 4
  const mapDimmed  = phase >= 5
  const showMain   = phase >= 5
  const showSub    = phase >= 6
  const showCTA    = phase >= 7

  return (
    <header className="relative isolate min-h-[100svh] overflow-hidden bg-canvas">
      {/* 薄いデータグリッド背景 */}
      <div className="absolute inset-0 grid-overlay opacity-70" aria-hidden="true" />
      {/* ごく薄いブルーグレーのグラデーション */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 55% at 50% 38%, rgba(0,14,153,0.04) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      {/* ───── 全画面アニメーション・ステージ ───── */}
      <div className="absolute inset-0" aria-hidden="true">

        {/* 静かな起点（phase 0 のみ） */}
        <div
          className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ top: `${MAP_TOP}%`, opacity: phase === 0 ? 1 : 0, transition: 'opacity 0.6s ease' }}
        >
          <span className="relative flex h-4 w-4 items-center justify-center">
            <span className="absolute h-8 w-8 rounded-full bg-accent/10 animate-breathe" />
            <span className="h-2.5 w-2.5 rounded-full bg-accent" />
          </span>
        </div>

        {/* 接続線（収束中のみ） */}
        <svg
          className="absolute inset-0 h-full w-full"
          style={{ opacity: converging && !themesGone ? 1 : 0, transition: 'opacity 0.7s ease' }}
          preserveAspectRatio="none"
        >
          {SCATTER.map((t, i) => (
            <line
              key={i}
              x1={`${t.x}%`} y1={`${t.y}%`} x2="50%" y2={`${MAP_TOP}%`}
              stroke="#000E99" strokeWidth="0.6" strokeOpacity="0.18" strokeDasharray="4 7"
            />
          ))}
        </svg>

        {/* テーマタグ：散布 → 中央収束 → フェード */}
        {SCATTER.map((t, i) => {
          const targetX = converging ? 50 : t.x
          const targetY = converging ? MAP_TOP : t.y
          const opacity = !showThemes ? 0 : themesGone ? 0 : 1
          return (
            <div
              key={t.ja}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${targetX}%`,
                top: `${targetY}%`,
                opacity,
                transition: [
                  `left 1.5s cubic-bezier(0.4,0,0.2,1) ${i * 0.03}s`,
                  `top 1.5s cubic-bezier(0.4,0,0.2,1) ${i * 0.03}s`,
                  `opacity 0.6s ease ${showThemes && !converging ? i * 0.12 : 0}s`,
                ].join(', '),
              }}
            >
              <div className="whitespace-nowrap rounded-full border border-accent/30 bg-white px-3.5 py-1.5 shadow-sm">
                <span className="font-sans text-sm font-semibold text-accent">{t.ja}</span>
              </div>
            </div>
          )
        })}

        {/* 日本列島シグナルマップ */}
        <div
          className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            top: `${MAP_TOP}%`,
            width: 'min(520px, 78vw)',
            aspectRatio: '480 / 600',
            opacity: showMap ? (mapDimmed ? 0.45 : 1) : 0,
            transform: `translate(-50%, -50%) scale(${showMap ? 1 : 0.9})`,
            transition: 'opacity 1.4s ease, transform 1.1s cubic-bezier(0.16,1,0.3,1)',
          }}
        >
          <JapanMap className="h-full w-full" lit={showMap} animateBeacons={!reduced && showMap} />
        </div>
      </div>

      {/* ───── コピーレイヤー（アニメーション後） ───── */}
      <div className="relative flex min-h-[100svh] flex-col items-center justify-end px-6 pb-24 text-center sm:pb-32">
        {/* 下部を白くしてコピーの可読性を確保 */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[58%] bg-gradient-to-t from-canvas via-canvas/85 to-transparent"
          style={{ opacity: showMain ? 1 : 0, transition: 'opacity 1.2s ease' }}
          aria-hidden="true"
        />

        <div className="relative z-10 w-full max-w-3xl">
          <p className="eyebrow justify-center" style={fade(showMain, 0)}>
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
            Japan Company Intelligence
          </p>

          <h1
            className="mt-5 font-display text-4xl font-bold leading-[1.12] tracking-tight text-ink sm:text-5xl lg:text-[3.4rem]"
            style={fade(showMain, 0.1)}
          >
            日本の産業シグナルを、
            <br />
            <span className="text-accent">市場が気づく前に。</span>
          </h1>

          <p
            className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-ink-muted sm:text-lg"
            style={fade(showSub, 0)}
          >
            半導体、宇宙、AI、防衛などの世界的な投資テーマを、
            <br className="hidden sm:block" />
            日本各地の企業・地域・産業構造と結びつけて読み解くリサーチプラットフォーム。
          </p>

          <div
            className="mt-8 flex flex-wrap items-center justify-center gap-4"
            style={fade(showCTA, 0)}
          >
            <a
              href="#access"
              className="rounded-full bg-accent px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-soft"
            >
              早期アクセスを申請
            </a>
            <a
              href="#explore"
              className="rounded-full border border-line px-7 py-3 text-sm font-medium text-ink transition-colors hover:border-accent hover:text-accent"
            >
              マップを見る
            </a>
          </div>
        </div>
      </div>

      {/* スクロール誘導 */}
      <div
        className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2"
        style={{ opacity: showCTA ? 1 : 0, transition: 'opacity 1.1s ease' }}
        aria-hidden="true"
      >
        <div className="flex flex-col items-center gap-2 text-ink-faint">
          <span className="text-[9px] uppercase tracking-[0.32em]">スクロール</span>
          <span className="h-7 w-px bg-gradient-to-b from-accent/40 to-transparent" />
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
