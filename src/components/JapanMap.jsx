import { REGIONS } from '../data'

// 日本列島シルエット（viewBox 0 0 480 600）。
// 精密な海岸線ではなく、4島が一目で「日本」と分かる簡略アウトライン。
const ISLANDS = {
  hokkaido:
    'M345,66 C366,52 398,58 408,84 C415,106 398,128 370,128 C346,128 330,108 333,88 C335,77 339,70 345,66 Z',
  honshu:
    'M336,148 C354,166 360,200 362,232 C364,256 376,258 370,276 C360,296 322,288 296,290 C250,296 200,316 172,332 C160,332 158,320 168,314 C204,300 250,292 282,282 C308,274 324,248 320,210 C317,184 322,162 336,148 Z',
  shikoku:
    'M198,360 C220,352 248,358 252,374 C256,390 234,398 212,394 C194,390 186,372 198,360 Z',
  kyushu:
    'M118,368 C140,358 164,368 165,392 C166,416 152,438 128,432 C106,426 98,398 107,382 C110,375 114,371 118,368 Z',
}

/**
 * 産業シグナルマップ。ヒーローと探索セクションで共有する純表示コンポーネント。
 *
 * props:
 *  - lit: 地域ノードを表示するか
 *  - animateBeacons: 順次フェードイン+pingを実行
 *  - interactive: ホバー/クリック有効化
 *  - activeRegion: ハイライト中の地域 id
 *  - onRegionEnter / onRegionLeave / onRegionSelect: (regionId) => void
 *  - showLabels: ラベル常時表示
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
      viewBox="0 0 480 600"
      className={className}
      role="img"
      aria-label="日本列島の産業シグナルマップ（8地域）"
    >
      <defs>
        <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#000E99" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#000E99" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* 控えめなデータグリッド（経緯線風） */}
      <g stroke="#11131C" strokeOpacity="0.05" strokeWidth="1">
        {[120, 240, 360].map((x) => (
          <line key={`v${x}`} x1={x} y1="20" x2={x} y2="580" />
        ))}
        {[120, 240, 360, 480].map((y) => (
          <line key={`h${y}`} x1="20" y1={y} x2="460" y2={y} />
        ))}
      </g>

      {/* 日本列島シルエット */}
      <g
        fill="#000E99"
        fillOpacity="0.05"
        stroke="#000E99"
        strokeOpacity="0.32"
        strokeWidth="1.25"
        strokeLinejoin="round"
      >
        {Object.entries(ISLANDS).map(([id, d]) => (
          <path key={id} d={d} />
        ))}
      </g>

      {/* 地域をつなぐ細い接続線（シグナルネットワーク） */}
      {lit && (
        <g stroke="#000E99" strokeOpacity="0.22" strokeWidth="0.9" fill="none">
          {REGIONS.slice(0, -1).map((r, i) => {
            const n = REGIONS[i + 1]
            return (
              <line
                key={r.id}
                x1={r.x}
                y1={r.y}
                x2={n.x}
                y2={n.y}
                style={
                  animateBeacons
                    ? { animation: `fade-in 0.7s ease ${0.4 + i * 0.18}s both` }
                    : undefined
                }
              />
            )
          })}
        </g>
      )}

      {/* 地域ノード */}
      {lit &&
        REGIONS.map((r, i) => {
          const isActive = activeRegion === r.id
          const nodeStyle = animateBeacons
            ? { animation: `fade-in 0.6s ease ${0.6 + i * 0.2}s both` }
            : undefined

          return (
            <g
              key={r.id}
              style={nodeStyle}
              className={interactive ? 'cursor-pointer' : ''}
              onMouseEnter={interactive ? () => onRegionEnter?.(r.id) : undefined}
              onMouseLeave={interactive ? () => onRegionLeave?.(r.id) : undefined}
              onClick={interactive ? () => onRegionSelect?.(r.id) : undefined}
            >
              {/* 柔らかなグロー（控えめ） */}
              <circle cx={r.x} cy={r.y} r={isActive ? 22 : 15} fill="url(#nodeGlow)" />

              {/* 単発の ping リング（発光しすぎない） */}
              <circle
                cx={r.x}
                cy={r.y}
                r="6"
                fill="none"
                stroke="#000E99"
                strokeWidth="1"
                style={{
                  transformOrigin: `${r.x}px ${r.y}px`,
                  animation: 'ping-ring 3.2s ease-out infinite',
                  animationDelay: `${0.8 + i * 0.25}s`,
                  opacity: 0,
                }}
              />

              {/* ノード本体 */}
              <circle
                cx={r.x}
                cy={r.y}
                r={isActive ? 6 : 4}
                fill={isActive ? '#000E99' : '#FFFFFF'}
                stroke="#000E99"
                strokeWidth="1.6"
                className="transition-all duration-200"
              />

              {interactive && (
                <circle cx={r.x} cy={r.y} r="26" fill="transparent" />
              )}

              {(showLabels || isActive) && (
                <text
                  x={r.x + 12}
                  y={r.y + 4}
                  fontSize="14"
                  fontFamily="Inter, 'Noto Sans JP', sans-serif"
                  fontWeight="600"
                  fill={isActive ? '#000E99' : '#4C5567'}
                  className="transition-colors duration-200 select-none"
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
