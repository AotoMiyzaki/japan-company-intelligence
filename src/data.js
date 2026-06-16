// 全コンテンツの一元管理。英語化時はここと各コンポーネントの固定文言を差し替える。

import { REGION_NODES } from './japan-geo'

// 代表テーマ（10）。サイト主言語は日本語、enは小ラベル用。
export const THEMES = [
  { ja: '半導体', en: 'Semiconductors' },
  { ja: 'AI', en: 'AI' },
  { ja: '防衛', en: 'Defense' },
  { ja: '宇宙', en: 'Space' },
  { ja: 'エネルギー', en: 'Energy' },
  { ja: '蓄電池', en: 'Batteries' },
  { ja: 'ロボティクス', en: 'Robotics' },
  { ja: '造船', en: 'Shipbuilding' },
  { ja: '金融', en: 'Financials' },
  { ja: '事業承継', en: 'Succession' },
]

// FVで散らすテーマ（散らかりを避けるため8つに絞る）
export const FV_THEMES = [
  '半導体', 'AI', '防衛', '宇宙', 'エネルギー', '蓄電池', 'ロボティクス', '金融',
]

// 地域コンテンツ。座標(x,y)は japan-geo.js（実地図データ由来）から自動付与する。
const REGION_CONTENT = [
  {
    id: 'hokkaido', en: 'Hokkaido', ja: '北海道',
    themes: ['半導体', '宇宙'],
    companies: 38,
    signal: '千歳周辺に新しい半導体ロジック・クラスターが形成されつつある。サプライヤーの北上が続いている。',
  },
  {
    id: 'tohoku', en: 'Tohoku', ja: '東北',
    themes: ['半導体', 'エネルギー'],
    companies: 52,
    signal: '精密部品メーカーが後工程パッケージング案件を取り込みつつ、再エネ関連投資も拡大している。',
  },
  {
    id: 'kanto', en: 'Kanto', ja: '関東',
    themes: ['AI', '金融'],
    companies: 214,
    signal: 'IPO前のAIインフラスタートアップが東京・つくば周辺にクラスター化している。',
  },
  {
    id: 'chubu', en: 'Chubu', ja: '中部',
    themes: ['ロボティクス', '蓄電池'],
    companies: 96,
    signal: 'モビリティのサプライチェーンが資本を蓄電池・産業ロボットへシフトしている。',
  },
  {
    id: 'kansai', en: 'Kansai', ja: '関西',
    themes: ['蓄電池', '金融'],
    companies: 118,
    signal: '大阪の素材・電池関連と金融が、拡大前の再編フェーズに入っている。',
  },
  {
    id: 'chugoku', en: 'Chugoku', ja: '中国',
    themes: ['造船', '防衛'],
    companies: 44,
    signal: '造船・素材企業が防衛サプライチェーンへの参入を本格化させている。',
  },
  {
    id: 'shikoku', en: 'Shikoku', ja: '四国',
    themes: ['事業承継', 'ロボティクス'],
    companies: 29,
    signal: '黒字の地場製造業で事業承継が進み、ロボティクス導入によるDXが加速している。',
  },
  {
    id: 'kyushu', en: 'Kyushu', ja: '九州',
    themes: ['半導体', '防衛'],
    companies: 87,
    signal: '「シリコンアイランド」の工場増設が、現状どの英語スクリーンにも映らないサプライヤー群を動かしている。',
  },
]

// 実地図データの座標をマージ（JapanMap の viewBox 0 0 438 516 に一致）
export const REGIONS = REGION_CONTENT.map((r) => ({
  ...r,
  ...REGION_NODES[r.id],
}))

export const LAYERS = [
  {
    tag: 'Layer 01',
    ja: '上場企業',
    desc: '東証上場企業を中心に、ファンダメンタルズ・ガバナンス改革・市場が織り込む前のシグナルを精査します。',
  },
  {
    tag: 'Layer 02',
    ja: '上場準備・有力未上場',
    desc: 'IPOを目前に控えた企業と高ポテンシャルの非上場銘柄——海外投資家が手遅れになるまで気づかないパイプラインです。',
  },
  {
    tag: 'Layer 03',
    ja: '無名の有望企業',
    desc: '非上場の中小・地方企業や同族経営の世界水準企業——英語でほぼ情報が存在しない、日本市場の最深部です。',
  },
]

export const LENSES = [
  {
    key: 'company',
    ja: '企業単位',
    desc: '3つのレイヤーを横断しながら企業ごとにプロファイル。財務・株主構成・サプライチェーン・シグナルを一覧します。',
  },
  {
    key: 'region',
    ja: '地域単位',
    desc: '北海道から九州まで8地域の産業モメンタムを追跡。現場で何が動いているかを地理的に把握できます。',
  },
  {
    key: 'theme',
    ja: 'テーマ単位',
    desc: '半導体・宇宙・AI・防衛といった世界の投資テーマから、それを実際に牽引している日本の銘柄へ直接アクセスします。',
  },
]

export const SAMPLE_SIGNAL = {
  kicker: 'シグナル例',
  region: '九州',
  theme: '半導体',
  title: '「シリコンアイランド」が、影に隠れたサプライチェーンを動かし始めている',
  summary:
    '九州北部の工場増設が、現存するいかなる英語スクリーンにも映らない非上場サプライヤー群への資金・人材・発注をルーティングし直している。クラスター全体をマッピングし、上場プロキシ銘柄と先行受益が期待される3つのIPO前銘柄を特定します。',
  metrics: [
    { label: 'マップ済み企業数', value: '87' },
    { label: 'IPO前候補', value: '3社' },
    { label: '上場プロキシ', value: '11社' },
  ],
}

export const WHY_JAPAN = [
  {
    ja: '進行中の市場再評価',
    desc: '東証主導のガバナンス改革と資本効率改善圧力が、数千社の上場企業を同時に変えつつあります。',
  },
  {
    ja: '通貨安が生んだ参入機会',
    desc: '円安が海外資本にとって上場・非上場の双方で一斉にバリュエーションをリセットしています。',
  },
  {
    ja: '事業承継の大波',
    desc: 'オーナー経営者世代の高齢化が、数十年ぶりに黒字の非上場企業を市場に出し始めています。',
  },
  {
    ja: '英語圏が見落としている技術の深度',
    desc: '地方・非上場企業が素材・部品・精密加工で持つ守りやすい優位性は、英語ではほとんど情報がありません。',
  },
]

export const AUDIENCES = [
  { ja: 'ファンド', desc: 'コンセンサスになる前に、テーマと銘柄を絞り込む。' },
  { ja: '機関投資家', desc: '上場・上場準備銘柄を横断して日本をカバーする。' },
  { ja: 'ファミリーオフィス', desc: '構造的な優位を持つ、オーナー系の耐久性ある企業を見つける。' },
  { ja: '事業会社', desc: 'パートナー・M&A候補・サプライチェーンを地域ごとにマッピングする。' },
]
