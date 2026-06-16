/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        base: '#05070D',
        panel: '#0B1020',
        panel2: '#10162B',
        signal: {
          DEFAULT: '#38BDF8',
          bright: '#7DD3FC',
          deep: '#0EA5E9',
        },
        gold: {
          DEFAULT: '#E6B450',
          deep: '#C99A3C',
        },
        ink: {
          DEFAULT: '#E6EAF2',
          muted: '#94A3B8',
          faint: '#5A6478',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'Inter', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      // Numeric aliases so `font-500/600/700` and `*/8` opacity resolve.
      fontWeight: {
        500: '500',
        600: '600',
        700: '700',
      },
      opacity: {
        8: '0.08',
      },
      keyframes: {
        spin: {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        'spin-reverse': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(-360deg)' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        beacon: {
          '0%': { opacity: '0', transform: 'scaleY(0)' },
          '40%': { opacity: '1' },
          '100%': { opacity: '0.85', transform: 'scaleY(1)' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.6)', opacity: '0.9' },
          '100%': { transform: 'scale(2.6)', opacity: '0' },
        },
        breathe: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.25)' },
        },
        'scan-line': {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '50%': { opacity: '0.5' },
          '100%': { transform: 'translateY(100%)', opacity: '0' },
        },
      },
      animation: {
        'orbit': 'spin 48s linear infinite',
        'orbit-fast': 'spin 32s linear infinite',
        'counter-orbit': 'spin-reverse 48s linear infinite',
        'fade-up': 'fade-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in': 'fade-in 1s ease forwards',
        'breathe': 'breathe 3.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
