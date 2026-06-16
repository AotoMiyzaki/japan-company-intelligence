import { useEffect, useState } from 'react'
import { THEMES } from '../data'
import { usePrefersReducedMotion } from '../hooks'
import JapanMap from './JapanMap'

// 各テーマワードの初期配置（ビューポート % 座標）。
// 画面全体に散らすことで「全国・全テーマを観測している」感を出す。
const SCATTER = [
  { ...THEMES[0], x: 11, y: 18 },  // 半導体  左上
  { ...THEMES[1], x: 76, y: 13 },  // 宇宙    右上
  { ...THEMES[2], x: 18, y: 54 },  // AI      左中
  { ...THEMES[3], x: 72, y: 50 },  // SaaS    右中
  { ...THEMES[4], x: 13, y: 80 },  // 銀行    左下
  { ...THEMES[5], x: 74, y: 82 },  // 防衛    右下
]

// フェーズ遷移タイムライン（マウントからの ms）
// 0: 種火
// 1: テーマワード散布
// 2: 収束開始（中央へ向かい、接続線出現）
// 3: 日本列島出現・ビーコン発光
// 4: テーマ非表示、地図が安定
// 5: メインコピー
// 6: サブコピー
// 7: CTAボタン
const TIMELINE = [700, 3000, 4800, 6200, 7400, 8600, 9600]

// 地図を置く Y 位置（画面中央からやや上）
const MAP_TOP = 42

export default function Hero() {
  const reduced = usePrefersReducedMotion()
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    if (reduced) { setPhase(7); return }
    const timers = TIMELINE.map((t, i) => setTimeout(() => setPhase(i + 1), t))
    return () => timers.forEach(clearTimeout)
  }, [reduced])

  const showThemes = phase >= 1
  const converging  = phase >= 2
  const showMap     = phase >= 3
  const themesGone  = phase >= 4
  const mapDimmed   = phase >= 5
  const showMain    = phase >= 5
  const showSub     = phase >= 6
  const showCTA     = phase >= 7

  return (
    <header className="relative isolate min-h-[100svh] overflow-hidden bg-base">
      {/* グリッド背景 */}
      <div className="absolute inset-0 grid-overlay opacity-25" aria-hidden="true" />

      {/* 中央グロー（常に微弱に光る） */}
      <div
        className="absolute inset-0 transition-opacity duration-2000"
        style={{
          background: `radial-gradient(ellipse 65% 52% at 50% ${MAP_TOP}%, rgba(56,189,248,0.09) 0%, transparent 68%)`,
        }}
        aria-hidden="true"
      />

      {/* ════════════════════════════════════
          全画面アニメーション・ステージ
          ════════════════════════════════════ */}
      <div className="absolute inset-0" aria-hidden="true">

        {/* 種火 — phase 0 のみ */}
        <div
          className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            top: `${MAP_TOP}%`,
            opacity: phase === 0 ? 1 : 0,
            transition: 'opacity 0.6s ease',
          }}
        >
          <span className="relative flex h-5 w-5 items-center justify-center">
            <span className="absolute h-10 w-10 rounded-full bg-signal/20 animate-breathe" />
            <span className="h-3 w-3 rounded-full bg-signal-bright shadow-[0_0_20px_8px_rgba(125,211,252,0.55)]" />
          </span>
        </div>

        {/* 接続線 SVG — phase 2（収束中）だけ表示 */}
        <svg
          className="absolute inset-0 h-full w-full"
          style={{
            opacity: converging && !themesGone ? 1 : 0,
            transition: 'opacity 0.8s ease',
          }}
          preserveAspectRatio="none"
        >
          {SCATTER.map((t, i) => (
            <line
              key={i}
              x1={`${t.x}%`}
              y1={`${t.y}%`}
              x2="50%"
              y2={`${MAP_TOP}%`}
              stroke="#38BDF8"
              strokeWidth="0.6"
              strokeOpacity="0.25"
              strokeDasharray="5 7"
            />
          ))}
        </svg>

        {/* テーマワード — 散布 → 中央収束 → フェード */}
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
                top:  `${targetY}%`,
                opacity,
                transition: [
                  `left 1.6s cubic-bezier(0.4,0,0.2,1) ${i * 0.04}s`,
                  `top  1.6s cubic-bezier(0.4,0,0.2,1) ${i * 0.04}s`,
                  `opacity 0.7s ease ${showThemes && !converging ? i * 0.16 : 0}s`,
                ].join(', '),
              }}
            >
              <div className="whitespace-nowrap rounded-full border border-signal/30 bg-panel/75 px-4 py-2 backdrop-blur-sm">
                <span className="font-display text-sm font-semibold text-ink">{t.ja}</span>
              </div>
            </div>
          )
        })}

        {/* 日本列島 — phase 3 以降。phase 5 から薄く dimming してコピーの背景に */}
        <div
          className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            top: `${MAP_TOP}%`,
            width: 'min(540px, 80vw)',
            aspectRatio: '1',
            opacity:   showMap ? (mapDimmed ? 0.28 : 1) : 0,
            transform: `translate(-50%, -50%) scale(${showMap ? 1 : 0.82})`,
            transition: 'opacity 1.6s ease, transform 1.2s cubic-bezier(0.16,1,0.3,1)',
          }}
        >
          <JapanMap
            className="h-full w-full"
            lit={showMap}
            animateBeacons={!reduced && showMap}
          />
        </div>
      </div>

      {/* ════════════════════════════════════
          コピーレイヤー — アニメーション後に表示
          ════════════════════════════════════ */}
      <div className="relative flex min-h-[100svh] flex-col items-center justify-end pb-28 sm:pb-36 px-6 text-center">
        {/* コピーを読みやすくするグラデーション */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[62%] bg-gradient-to-t from-base via-base/80 to-transparent"
          style={{ opacity: showMain ? 1 : 0, transition: 'opacity 1.4s ease' }}
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-3xl w-full">
          {/* アイブロウ */}
          <p
            className="eyebrow justify-center"
            style={fade(showMain, 0)}
          >
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-signal animate-breathe" />
            Japan Company Intelligence
          </p>

          {/* メインコピー */}
          <h1
            className="mt-5 font-display text-4xl sm:text-5xl lg:text-[3.5rem] font-bold leading-[1.1] tracking-tight"
            style={fade(showMain, 0.1)}
          >
            日本の産業シグナルを、
            <br />
            <span className="signal-text">市場が気づく前に。</span>
          </h1>

          {/* サブコピー */}
          <p
            className="mt-6 text-base sm:text-lg leading-relaxed text-ink-muted mx-auto max-w-2xl"
            style={fade(showSub, 0)}
          >
            半導体、宇宙、AI、防衛といった世界の投資テーマを、
            <br className="hidden sm:block" />
            日本の企業・地域・産業の動きとつなげて読み解くためのリサーチ基盤です。
          </p>

          {/* CTAボタン */}
          <div
            className="mt-8 flex flex-wrap items-center justify-center gap-4"
            style={fade(showCTA, 0)}
          >
            <a
              href="#access"
              className="rounded-full bg-signal px-7 py-3 text-sm font-semibold text-base transition-colors hover:bg-signal-bright"
            >
              早期アクセスを申請
            </a>
            <a
              href="#explore"
              className="rounded-full border border-white/15 px-7 py-3 text-sm font-medium text-ink transition-colors hover:border-signal/60 hover:text-signal-bright"
            >
              マップを見る
            </a>
          </div>
        </div>
      </div>

      {/* スクロール誘導 */}
      <div
        className="pointer-events-none absolute bottom-7 left-1/2 -translate-x-1/2"
        style={{ opacity: showCTA ? 1 : 0, transition: 'opacity 1.2s ease' }}
        aria-hidden="true"
      >
        <div className="flex flex-col items-center gap-2 text-ink-faint">
          <span className="text-[9px] uppercase tracking-[0.32em]">スクロール</span>
          <span className="h-7 w-px bg-gradient-to-b from-signal/50 to-transparent" />
        </div>
      </div>
    </header>
  )
}

// テキストフェードイン用のインラインスタイルヘルパー
function fade(visible, delay = 0) {
  return {
    opacity:    visible ? 1 : 0,
    transform:  visible ? 'translateY(0)' : 'translateY(18px)',
    transition: `opacity 1s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 1s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
  }
}
