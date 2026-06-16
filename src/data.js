// Central content & data model for the platform.
// Region coordinates are expressed in the JapanMap SVG viewBox (0 0 440 560),
// laid out along Japan's real NE -> SW archipelago diagonal.

export const THEMES = [
  { en: 'Semiconductors', ja: '半導体' },
  { en: 'Space', ja: '宇宙' },
  { en: 'AI', ja: 'AI' },
  { en: 'SaaS', ja: 'SaaS' },
  { en: 'Banking', ja: '銀行' },
  { en: 'Defense', ja: '防衛' },
]

// Lit in this order during the FV (north -> south = a statement of coverage).
export const REGIONS = [
  {
    id: 'hokkaido',
    en: 'Hokkaido',
    ja: '北海道',
    x: 332,
    y: 92,
    themes: ['Semiconductors', 'Space'],
    companies: 38,
    signal: 'A new logic-chip cluster is forming around Chitose as suppliers relocate north.',
  },
  {
    id: 'tohoku',
    en: 'Tohoku',
    ja: '東北',
    x: 300,
    y: 188,
    themes: ['Semiconductors', 'Defense'],
    companies: 52,
    signal: 'Precision-parts makers are quietly winning back-end packaging contracts.',
  },
  {
    id: 'kanto',
    en: 'Kanto',
    ja: '関東',
    x: 318,
    y: 268,
    themes: ['AI', 'SaaS', 'Banking'],
    companies: 214,
    signal: 'Pre-IPO AI infrastructure startups are clustering around Tokyo and Tsukuba.',
  },
  {
    id: 'chubu',
    en: 'Chubu',
    ja: '中部',
    x: 258,
    y: 282,
    themes: ['Defense', 'Semiconductors'],
    companies: 96,
    signal: 'Mobility supply chains are pivoting capital toward power-semiconductor lines.',
  },
  {
    id: 'kansai',
    en: 'Kansai',
    ja: '関西',
    x: 214,
    y: 320,
    themes: ['SaaS', 'Banking'],
    companies: 118,
    signal: 'Osaka fintech and vertical-SaaS names are consolidating ahead of expansion.',
  },
  {
    id: 'chugoku',
    en: 'Chugoku',
    ja: '中国',
    x: 158,
    y: 334,
    themes: ['Defense', 'Space'],
    companies: 44,
    signal: 'Shipbuilding and materials firms are entering the defense supply base.',
  },
  {
    id: 'shikoku',
    en: 'Shikoku',
    ja: '四国',
    x: 182,
    y: 386,
    themes: ['SaaS', 'AI'],
    companies: 29,
    signal: 'Regional manufacturers are digitizing fast through home-grown vertical SaaS.',
  },
  {
    id: 'kyushu',
    en: 'Kyushu',
    ja: '九州',
    x: 108,
    y: 402,
    themes: ['Semiconductors', 'Space'],
    companies: 87,
    signal: 'The "Silicon Island" foundry build-out is pulling in a wave of suppliers.',
  },
]

export const LAYERS = [
  {
    tag: 'Layer 01',
    en: 'Listed',
    ja: '上場企業',
    desc: 'Public companies on the TSE and beyond — read through fundamentals, governance reform, and the signals priced in before the market reacts.',
  },
  {
    tag: 'Layer 02',
    en: 'Emerging & Pre-IPO',
    ja: '上場準備・有力未上場',
    desc: 'Companies preparing to list and high-potential private names — the pipeline overseas investors rarely see until it is too late.',
  },
  {
    tag: 'Layer 03',
    en: 'Hidden Champions',
    ja: '無名の有望企業',
    desc: 'Unlisted SMEs, regional leaders, and family businesses with world-class niches — the part of Japan that almost never appears in English.',
  },
]

export const LENSES = [
  {
    key: 'company',
    en: 'By Company',
    ja: '企業単位',
    desc: 'Profile any company across the three layers — financials, ownership, supply chain, and the signals that move it.',
  },
  {
    key: 'region',
    en: 'By Region',
    ja: '地域単位',
    desc: 'Trace industrial momentum across eight regions, from Hokkaido to Kyushu, where the real activity happens on the ground.',
  },
  {
    key: 'theme',
    en: 'By Theme',
    ja: 'テーマ単位',
    desc: 'Follow a global investment theme — semiconductors, space, AI, defense — down to the Japanese names actually driving it.',
  },
]

export const SAMPLE_SIGNAL = {
  kicker: 'Featured Signal',
  region: 'Kyushu',
  theme: 'Semiconductors',
  title: '"Silicon Island" is pulling its supply base out of the shadows',
  summary:
    'A foundry build-out in northern Kyushu is rerouting capital, talent, and orders into a tier of unlisted suppliers that no English-language screen currently surfaces. We map the cluster, the listed proxies, and three pre-IPO names positioned to benefit first.',
  metrics: [
    { label: 'Companies mapped', value: '87' },
    { label: 'Pre-IPO flagged', value: '3' },
    { label: 'Listed proxies', value: '11' },
  ],
}

export const WHY_JAPAN = [
  {
    en: 'A re-rating in motion',
    desc: 'Exchange-led governance reform and capital-efficiency pressure are forcing change at thousands of listed companies at once.',
  },
  {
    en: 'A currency-driven entry point',
    desc: 'A weak yen has reset valuations for foreign capital across both public and private assets.',
  },
  {
    en: 'A succession wave',
    desc: 'An aging owner generation is putting profitable, unlisted businesses into play for the first time in decades.',
  },
  {
    en: 'Hidden technical depth',
    desc: 'Regional and unlisted firms hold defensible niches in materials, components, and precision manufacturing — largely invisible in English.',
  },
]

export const AUDIENCES = [
  { en: 'Funds', desc: 'Sharpen the thesis and source names before they are consensus.' },
  { en: 'Institutional Investors', desc: 'Cover Japan with depth across listed and pre-listed assets.' },
  { en: 'Family Offices', desc: 'Find durable, owner-led businesses with structural moats.' },
  { en: 'Corporates', desc: 'Map partners, targets, and supply chains region by region.' },
]
