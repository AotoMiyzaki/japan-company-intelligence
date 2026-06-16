import { REGIONS } from '../data'
import { JAPAN_VIEWBOX, PREFECTURE_PATHS } from '../japan-geo'

// 地域ビーコン（光の柱 + ノード + pingリング）
function Beacon({ r, i, isActive, animateBeacons, tone }) {
  const beamHeight = 42
  const c = tone.beacon
  const beamStyle = animateBeacons
    ? { animation: `beacon-rise 0.65s ease ${0.8 + i * 0.16}s both`, transformOrigin: 'bottom' }
    : undefined
  const groupStyle = animateBeacons
    ? { animation: `fade-in 0.5s ease ${0.75 + i * 0.16}s both` }
    : undefined

  return (
    <g style={groupStyle}>
      {/* 光の柱（幅2px、明るく） */}
      <rect
        x={r.x - 1}
        y={r.y - beamHeight}
        width={2}
        height={beamHeight}
        fill={`url(#beam-${tone.id})`}
        style={beamStyle}
      />
      {/* 外周グロー（三層） */}
      <circle cx={r.x} cy={r.y} r={isActive ? 22 : 16} fill={`url(#glow-far-${tone.id})`} className="transition-all duration-200" />
      <circle cx={r.x} cy={r.y} r={isActive ? 13 : 9}  fill={`url(#glow-outer-${tone.id})`} className="transition-all duration-200" />
      <circle cx={r.x} cy={r.y} r={isActive ? 7 : 5}   fill={`url(#glow-${tone.id})`} className="transition-all duration-200" />
      {/* pingリング（内） */}
      <circle
        cx={r.x} cy={r.y} r={3.5}
        fill="none" stroke={c} strokeWidth="1"
        style={{
          transformOrigin: `${r.x}px ${r.y}px`,
          animation: 'ping-ring 2.8s ease-out infinite',
          animationDelay: `${1.2 + i * 0.22}s`,
          opacity: 0,
        }}
      />
      {/* pingリング（外、遅延） */}
      <circle
        cx={r.x} cy={r.y} r={3.5}
        fill="none" stroke={c} strokeWidth="0.6"
        style={{
          transformOrigin: `${r.x}px ${r.y}px`,
          animation: 'ping-ring-outer 3.4s ease-out infinite',
          animationDelay: `${1.8 + i * 0.22}s`,
          opacity: 0,
        }}
      />
      {/* ノード本体 */}
      <circle
        cx={r.x} cy={r.y}
        r={isActive ? 4 : 2.8}
        fill={isActive ? c : tone.nodeFill}
        stroke={c}
        strokeWidth={1.4}
        className="transition-all duration-200"
        style={{ filter: `drop-shadow(0 0 4px ${c}) drop-shadow(0 0 8px ${c})` }}
      />
    </g>
  )
}

/**
 * 日本列島 産業シグナルマップ（共有）。
 * @svg-maps/japan 由来の47都道府県パスを正確なアウトラインとして描画する。
 *
 * props:
 *  variant        — 'dark'（FV用）| 'light'（白背景セクション用）
 *  lit            — 地域ノード/ビーコンを表示
 *  animateBeacons — 順次フェードイン演出
 *  interactive    — ホバー/クリック有効
 *  activeRegion   — ハイライト中の地域ID
 *  onRegionEnter / onRegionLeave / onRegionSelect
 *  showLabels     — ラベル常時表示
 */
export default function JapanMap({
  variant = 'light',
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
  const tone = variant === 'dark'
    ? {
        id: 'dark',
        land: '#0E1A3A',
        landStroke: '#4A7FEF',
        landStrokeOpacity: 0.75,
        grid: '#5B8DEF',
        gridOpacity: 0.07,
        link: '#5B8DEF',
        linkOpacity: 0.42,
        beacon: '#7DB0FF',
        nodeFill: '#0A1330',
        label: '#9FB8E8',
        labelActive: '#CFE0FF',
      }
    : {
        id: 'light',
        land: '#E9EDF8',
        landStroke: '#000E99',
        landStrokeOpacity: 0.45,
        grid: '#000E99',
        gridOpacity: 0.06,
        link: '#000E99',
        linkOpacity: 0.2,
        beacon: '#000E99',
        nodeFill: '#FFFFFF',
        label: '#4C5567',
        labelActive: '#000E99',
      }

  return (
    <svg viewBox={JAPAN_VIEWBOX} className={className} role="img" aria-label="日本列島の産業シグナルマップ（8地域）">
      <defs>
        <linearGradient id={`beam-${tone.id}`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor={tone.beacon} stopOpacity="0" />
          <stop offset="100%" stopColor={tone.beacon} stopOpacity={variant === 'dark' ? 0.95 : 0.5} />
        </linearGradient>
        <radialGradient id={`glow-${tone.id}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={tone.beacon} stopOpacity={variant === 'dark' ? 0.7 : 0.2} />
          <stop offset="100%" stopColor={tone.beacon} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`glow-outer-${tone.id}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={tone.beacon} stopOpacity={variant === 'dark' ? 0.35 : 0.12} />
          <stop offset="100%" stopColor={tone.beacon} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`glow-far-${tone.id}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={tone.beacon} stopOpacity={variant === 'dark' ? 0.15 : 0.04} />
          <stop offset="100%" stopColor={tone.beacon} stopOpacity="0" />
        </radialGradient>
        {variant === 'dark' && (
          <filter id="land-edge-glow" x="-2%" y="-2%" width="104%" height="104%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        )}
      </defs>

      {/* 経緯線グリッド */}
      <g stroke={tone.grid} strokeOpacity={tone.gridOpacity} strokeWidth="0.6">
        {[110, 220, 330].map((x) => (
          <line key={`v${x}`} x1={x} y1="0" x2={x} y2="516" />
        ))}
        {[90, 180, 270, 360, 450].map((y) => (
          <line key={`h${y}`} x1="0" y1={y} x2="438" y2={y} />
        ))}
      </g>

      {/* 日本列島（47都道府県を束ねたアウトライン） */}
      <g
        fill={tone.land}
        stroke={tone.landStroke}
        strokeOpacity={tone.landStrokeOpacity}
        strokeWidth="0.6"
        strokeLinejoin="round"
        filter={variant === 'dark' ? 'url(#land-edge-glow)' : undefined}
      >
        {PREFECTURE_PATHS.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>

      {/* 地域間の接続線 */}
      {lit && (
        <g stroke={tone.link} strokeOpacity={tone.linkOpacity} strokeWidth="0.7" fill="none" strokeDasharray="3 4">
          {REGIONS.slice(0, -1).map((r, i) => {
            const next = REGIONS[i + 1]
            return (
              <line
                key={r.id}
                x1={r.x} y1={r.y} x2={next.x} y2={next.y}
                style={animateBeacons ? { animation: `fade-in 0.6s ease ${0.6 + i * 0.14}s both` } : undefined}
              />
            )
          })}
        </g>
      )}

      {/* 地域ビーコン */}
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
            <Beacon r={r} i={i} isActive={isActive} animateBeacons={animateBeacons} tone={tone} />
            {interactive && <circle cx={r.x} cy={r.y} r={16} fill="transparent" />}
            {(showLabels || isActive) && (
              <text
                x={r.x + 7} y={r.y + 2.5}
                fontSize="8.5" fontWeight="600"
                fontFamily="Inter, 'Noto Sans JP', sans-serif"
                fill={isActive ? tone.labelActive : tone.label}
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
