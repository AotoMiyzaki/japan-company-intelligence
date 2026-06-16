import { useEffect, useRef, useState } from 'react'
import { FV_THEMES } from '../data'
import { usePrefersReducedMotion } from '../hooks'
import JapanMap from './JapanMap'

// ── フェーズ定義（マウントからの ms） ─────────────────────────────────
// 0: 静止（軌道リング）
// 1: テーマが軌道上に出現・回転
// 2: 回転が減速しながら収束
// 3: 日本列島が出現、ビーコン点灯
// 4: テーマ消去・列島安定
// 5: メインコピー
// 6: サブコピー
// 7: CTAボタン
const TIMELINE = [800, 2600, 4400, 5800, 7000, 8000, 9000]

// 軌道リングのパラメータ（画面幅に依存しないよう相対値で定義）
const RX = 36  // 楕円の X 半径（ビューポート % に対する相対値）
const RY = 14  // 楕円の Y 半径（%）

// 各テーマを楕円上に均等配置
function getOrbitPos(index, total, rx = RX, ry = RY) {
  const angle = (index / total) * 2 * Math.PI - Math.PI / 2 // 12時から開始
  return {
    x: 50 + rx * Math.cos(angle),
    y: 42 + ry * Math.sin(angle),
  }
}

// テーマ数
const N = FV_THEMES.length

export default function Hero() {
  const reduced = usePrefersReducedMotion()
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    if (reduced) { setPhase(7); return }
    const timers = TIMELINE.map((t, i) => setTimeout(() => setPhase(i + 1), t))
    return () => timers.forEach(clearTimeout)
  }, [reduced])

  const showOrbit    = phase >= 1
  const converging   = phase >= 2
  const showMap      = phase >= 3
  const themesGone   = phase >= 4
  const mapDimmed    = phase >= 5
  const showMain     = phase >= 5
  const showSub      = phase >= 6
  const showCTA      = phase >= 7

  return (
    <header className="relative isolate min-h-[100svh] overflow-hidden bg-canvas">

      {/* 薄いデータグリッド */}
      <div className="absolute inset-0 grid-overlay opacity-60" aria-hidden="true" />

      {/* 淡いアクセントグラデーション */}
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 68% 50% at 50% 40%, rgba(0,14,153,0.05), transparent 70%)' }}
        aria-hidden="true"
      />

      {/* ══════════════════════════════════════════
          全画面アニメーション・ステージ
          ══════════════════════════════════════════ */}
      <div className="absolute inset-0" aria-hidden="true">

        {/* 軌道リング（SVG、フェーズ0〜2） */}
        <svg
          className="absolute inset-0 h-full w-full"
          style={{
            opacity: showOrbit && !themesGone ? 1 : 0,
            transition: 'opacity 0.8s ease',
          }}
          preserveAspectRatio="none"
        >
          {/* 外側楕円（メイン軌道） */}
          <ellipse
            cx="50%" cy="42%"
            rx={`${RX}%`} ry={`${RY}%`}
            fill="none"
            stroke="#000E99" strokeOpacity="0.14" strokeWidth="1"
            strokeDasharray="7 5"
          />
          {/* 内側の補助楕円（奥行き感） */}
          <ellipse
            cx="50%" cy="42%"
            rx={`${RX * 0.55}%`} ry={`${RY * 0.55}%`}
            fill="none"
            stroke="#000E99" strokeOpacity="0.07" strokeWidth="0.8"
          />
          {/* 軌道上の矢印（回転方向の暗示） */}
          {[0.15, 0.4, 0.65, 0.88].map((t, i) => {
            const angle = t * 2 * Math.PI
            const cx = 50 + RX * Math.cos(angle)
            const cy = 42 + RY * Math.sin(angle)
            const tangentAngle = Math.atan2(
              -RX * Math.sin(angle) / RY,
              RY * Math.cos(angle) / RX
            ) * (180 / Math.PI) + 90
            return (
              <g
                key={i}
                transform={`translate(${cx}%, ${cy}%) rotate(${tangentAngle})`}
                opacity="0.2"
              >
                <polygon points="0,-5 4,3 -4,3" fill="#000E99" />
              </g>
            )
          })}
          {/* 中心の十字 */}
          <line x1="49.4%" y1="42%" x2="50.6%" y2="42%" stroke="#000E99" strokeOpacity="0.15" strokeWidth="1" />
          <line x1="50%" y1="40.6%" x2="50%" y2="43.4%" stroke="#000E99" strokeOpacity="0.15" strokeWidth="1" />
        </svg>

        {/* テーマタグ — 軌道配置 → 中央収束 → フェード */}
        {FV_THEMES.map((ja, i) => {
          const pos = getOrbitPos(i, N)
          const targetX = converging ? 50 : pos.x
          const targetY = converging ? 42 : pos.y
          const opacity = !showOrbit ? 0 : themesGone ? 0 : 1

          // 収束時に微妙なずれを出して消える（重なりすぎない）
          const offsetX = converging ? (i % 3 - 1) * 1.5 : 0
          const offsetY = converging ? (Math.floor(i / 3) % 2 - 0.5) * 2 : 0

          return (
            <div
              key={ja}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${targetX + offsetX}%`,
                top:  `${targetY + offsetY}%`,
                opacity,
                transition: [
                  `left 1.8s cubic-bezier(0.4,0,0.2,1) ${i * 0.035}s`,
                  `top  1.8s cubic-bezier(0.4,0,0.2,1) ${i * 0.035}s`,
                  `opacity 0.6s ease ${showOrbit && !converging ? i * 0.1 : 0}s`,
                ].join(', '),
              }}
            >
              <div className="whitespace-nowrap rounded-full border border-accent/30 bg-white px-3.5 py-1.5 shadow-sm">
                <span className="font-display text-sm font-semibold text-accent">{ja}</span>
              </div>
            </div>
          )
        })}

        {/* 回転するダミー要素（楕円軌道に沿った動き感を演出）
            — 実際のテーマとは別に、軌道上を動くドット群 */}
        {showOrbit && !converging && !reduced && (
          <div
            className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2"
            style={{ width: '72vw', height: '28vw', animation: 'orbit 28s linear infinite' }}
          >
            {[0.08, 0.33, 0.58, 0.83].map((t, i) => {
              const a = t * 2 * Math.PI
              const x = 50 + 50 * Math.cos(a)  // % of container
              const y = 50 + 50 * Math.sin(a)
              return (
                <div
                  key={i}
                  className="absolute h-1.5 w-1.5 rounded-full bg-accent"
                  style={{
                    left: `${x}%`, top: `${y}%`,
                    opacity: 0.2,
                    transform: 'translate(-50%, -50%)',
                  }}
                />
              )
            })}
          </div>
        )}

        {/* 日本列島 */}
        <div
          className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            top: '42%',
            width: 'min(500px, 76vw)',
            aspectRatio: '500 / 590',
            opacity:   showMap ? (mapDimmed ? 0.4 : 1) : 0,
            transform: `translate(-50%, -50%) scale(${showMap ? 1 : 0.88})`,
            transition: 'opacity 1.4s ease, transform 1.2s cubic-bezier(0.16,1,0.3,1)',
          }}
        >
          <JapanMap
            className="h-full w-full"
            lit={showMap}
            animateBeacons={!reduced && showMap}
          />
        </div>
      </div>

      {/* ══════════════════════════════════════════
          コピーレイヤー（アニメーション後に表示）
          ══════════════════════════════════════════ */}
      <div className="relative flex min-h-[100svh] flex-col items-center justify-end px-6 pb-24 text-center sm:pb-32">
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[56%] bg-gradient-to-t from-canvas via-canvas/88 to-transparent"
          style={{ opacity: showMain ? 1 : 0, transition: 'opacity 1.2s ease' }}
          aria-hidden="true"
        />

        <div className="relative z-10 w-full max-w-3xl">
          <p className="eyebrow justify-center" style={fade(showMain, 0)}>
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" style={{ animation: 'breathe 3.5s ease-in-out infinite' }} />
            Japan Company Intelligence
          </p>

          <h1
            className="mt-5 font-display text-4xl font-bold leading-[1.1] tracking-tight text-ink sm:text-5xl lg:text-[3.4rem]"
            style={fade(showMain, 0.08)}
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
        style={{ opacity: showCTA ? 0.7 : 0, transition: 'opacity 1.2s ease' }}
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
    opacity:   visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(16px)',
    transition: `opacity 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
  }
}
