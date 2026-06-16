/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // 白ベースのリサーチプラットフォーム配色
        canvas: '#FFFFFF',     // ページ背景
        mist: '#F7F8FC',       // 薄いブルーグレーの面・カード
        mist2: '#EEF1F9',      // やや濃いめの面
        line: '#E3E7F1',       // 罫線・境界
        accent: {
          DEFAULT: '#000E99',  // 主アクセント
          soft: '#4651C4',     // 補助（ホバー・薄め）
          wash: '#EBEDFB',     // ごく薄いアクセント面
        },
        ink: {
          DEFAULT: '#11131C',  // 見出し
          muted: '#4C5567',    // 本文
          faint: '#8A93A6',    // 補足
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'Inter', '"Noto Sans JP"', 'system-ui', 'sans-serif'],
        sans: ['Inter', '"Noto Sans JP"', 'system-ui', 'sans-serif'],
      },
      fontWeight: {
        500: '500',
        600: '600',
        700: '700',
      },
      opacity: {
        8: '0.08',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'ping-ring': {
          '0%': { transform: 'scale(0.6)', opacity: '0.5' },
          '100%': { transform: 'scale(2.4)', opacity: '0' },
        },
        breathe: {
          '0%, 100%': { opacity: '0.5', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.18)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 1s ease forwards',
        'breathe': 'breathe 3.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
