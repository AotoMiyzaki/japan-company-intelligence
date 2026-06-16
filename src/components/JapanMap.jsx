import { REGIONS } from '../data'

// ── 日本列島シルエット ──────────────────────────────────────────────
// viewBox 0 0 500 590。経緯線近似の簡略アウトラインで、
// 4島（北海道・本州・四国・九州）が一目で「日本」と分かるよう設計。
// 全て時計回りの単純クローズドパス。

const HOKKAIDO = `
  M 318,82 C 318,62 332,46 355,40 C 380,34 410,44 432,64
  C 452,82 458,108 446,130 C 434,150 410,162 384,160
  C 356,158 326,144 312,124 C 300,106 306,94 318,82 Z
`

// 本州：東北NE端 → 関東 → 紀伊半島 → 近畿 → 中国地方 → SW端、
//        日本海側を北東へ戻る（能登半島を含む）
const HONSHU = `
  M 352,154
  C 362,144 378,142 394,152
  C 412,164 422,186 428,212
  C 434,238 432,262 424,282
  C 414,302 398,314 386,322
  C 372,330 356,332 344,340
  C 332,350 322,364 316,382
  C 310,398 318,414 330,414
  C 342,414 352,404 354,390
  C 356,374 348,360 336,356
  C 320,352 300,354 280,356
  C 258,358 236,356 214,356
  C 190,358 166,362 144,364
  C 122,366 98,364 80,356
  C 62,346 60,330 74,318
  C 90,306 116,300 142,294
  C 166,288 188,282 202,270
  C 212,260 208,246 198,240
  C 188,234 176,238 172,250
  C 168,262 174,276 186,280
  C 200,284 218,278 232,268
  C 250,256 262,236 268,216
  C 274,196 270,172 278,156
  C 288,138 312,132 336,140
  C 346,144 350,150 352,154 Z
`

const SHIKOKU = `
  M 196,368 C 214,358 244,358 268,370
  C 290,382 298,402 286,418
  C 274,434 246,440 220,434
  C 194,426 178,408 186,392
  C 188,380 192,372 196,368 Z
`

const KYUSHU = `
  M 80,354 C 100,342 128,342 152,356
  C 174,370 182,396 174,420
  C 166,442 142,456 116,452
  C 90,448 70,428 68,404
  C 66,380 72,360 80,354 Z
`

// 離島（対馬など）— 小さい円で示すのみ
const SMALL_ISLANDS = [
  { cx: 58, cy: 302, r: 7,  label: '対馬' },
  { cx: 44, cy: 328, r: 5,  label: '壱岐' },
]

// ── 地域ノードに光の柱（ビーコン） ───────────────────────────────────
function Beacon({ r, i, isActive, animateBeacons }) {
  const beamHeight = 60
  const style = animateBeacons
    ? { animation: `beacon-rise 0.8s ease ${0.8 + i * 0.22}s both` }
    : undefined
  const fadeStyle = animateBeacons
    ? { animation: `fade-in 0.6s ease ${0.7 + i * 0.22}s both` }
    : undefined

  return (
    <g style={fadeStyle}>
      {/* 薄い光柱（上向き） */}
      <rect
        x={r.x - 1}
        y={r.y - beamHeight}
        width={2}
        height={beamHeight}
        fill={`url(#beamGrad${i})`}
        style={style}
      />
      {/* ノード外周グロー */}
      <circle
        cx={r.x}
        cy={r.y}
        r={isActive ? 20 : 14}
        fill="#000E99"
        fillOpacity={isActive ? 0.12 : 0.07}
        className="transition-all duration-200"
      />
      {/* Pingリング */}
      <circle
        cx={r.x} cy={r.y} r={5}
        fill="none" stroke="#000E99" strokeWidth="1"
        style={{
          transformOrigin: `${r.x}px ${r.y}px`,
          animation: `ping-ring 3s ease-out infinite`,
          animationDelay: `${1.2 + i * 0.28}s`,
          opacity: 0,
        }}
      />
      {/* ノード本体 */}
      <circle
        cx={r.x} cy={r.y}
        r={isActive ? 6 : 4.5}
        fill={isActive ? '#000E99' : '#fff'}
        stroke="#000E99"
        strokeWidth={1.8}
        className="transition-all duration-200"
      />
    </g>
  )
}

/**
 * 日本列島産業シグナルマップ（共有コンポーネント）
 *
 * props:
 *  lit            — 地域ノード/ビーコンを表示
 *  animateBeacons — 順次フェードイン+ビーコン演出
 *  interactive    — ホバー/クリック有効
 *  activeRegion   — ハイライト中の地域ID
 *  onRegionEnter / onRegionLeave / onRegionSelect
 *  showLabels     — ラベル常時表示
 */
export default function JapanMap({
  lit = true,
  animateBeacons = false,
  interactive = false,
  activeRegion = null,
  onRegionEnter,
  onRegionLeave,
  onRegionSelect,
  showLabels = false,
  className = '',
}) {
  return (
    <svg
      viewBox="0 0 500 590"
      className={className}
      role="img"
      aria-label="日本列島の産業シグナルマップ（8地域）"
    >
      <defs>
        {/* 各ビーコンの上方向グラデーション */}
        {REGIONS.map((r, i) => (
          <linearGradient key={i} id={`beamGrad${i}`} x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#000E99" stopOpacity="0" />
            <stop offset="100%" stopColor="#000E99" stopOpacity="0.55" />
          </linearGradient>
        ))}
        {/* 島の薄いグロー */}
        <filter id="islandGlow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* ── 経緯線グリッド（控えめ） ── */}
      <g stroke="#000E99" strokeOpacity="0.06" strokeWidth="0.8">
        {[125, 250, 375].map(x => (
          <line key={`v${x}`} x1={x} y1="10" x2={x} y2="575" />
        ))}
        {[100, 200, 300, 400, 500].map(y => (
          <line key={`h${y}`} x1="10" y1={y} x2="490" y2={y} />
        ))}
      </g>

      {/* ── 日本列島シルエット（4島） ── */}
      <g
        fill="#EEF1FA"
        stroke="#000E99"
        strokeOpacity="0.5"
        strokeWidth="1.4"
        strokeLinejoin="round"
        filter="url(#islandGlow)"
      >
        <path d={HOKKAIDO} />
        <path d={HONSHU} />
        <path d={SHIKOKU} />
        <path d={KYUSHU} />
      </g>

      {/* 小離島 */}
      <g fill="#EEF1FA" stroke="#000E99" strokeOpacity="0.4" strokeWidth="1">
        {SMALL_ISLANDS.map(isle => (
          <circle key={isle.label} cx={isle.cx} cy={isle.cy} r={isle.r} />
        ))}
      </g>

      {/* ── 地域間の接続線 ── */}
      {lit && (
        <g stroke="#000E99" strokeOpacity="0.18" strokeWidth="0.9" fill="none" strokeDasharray="4 5">
          {REGIONS.slice(0, -1).map((r, i) => {
            const next = REGIONS[i + 1]
            return (
              <line
                key={r.id}
                x1={r.x} y1={r.y} x2={next.x} y2={next.y}
                style={animateBeacons
                  ? { animation: `fade-in 0.7s ease ${0.5 + i * 0.16}s both` }
                  : undefined
                }
              />
            )
          })}
        </g>
      )}

      {/* ── 地域ビーコン ── */}
      {lit && REGIONS.map((r, i) => {
        const isActive = activeRegion === r.id
        return (
          <g
            key={r.id}
            className={interactive ? 'cursor-pointer' : ''}
            onMouseEnter={interactive ? () => onRegionEnter?.(r.id) : undefined}
            onMouseLeave={interactive ? () => onRegionLeave?.(r.id) : undefined}
            onClick={interactive ? () => onRegionSelect?.(r.id) : undefined}
          >
            <Beacon r={r} i={i} isActive={isActive} animateBeacons={animateBeacons} />
            {interactive && (
              <circle cx={r.x} cy={r.y} r={28} fill="transparent" />
            )}
            {(showLabels || isActive) && (
              <text
                x={r.x + 13} y={r.y + 4}
                fontSize="13" fontWeight="600"
                fontFamily="Inter, 'Noto Sans JP', sans-serif"
                fill={isActive ? '#000E99' : '#4C5567'}
                className="select-none transition-colors duration-200"
              >
                {r.ja}
              </text>
            )}
          </g>
        )
      })}
    </svg>
  )
}
