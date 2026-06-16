import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// `base: './'` emits relative asset paths so the built `dist/` works whether
// it is uploaded to a domain root or a subdirectory via FTP (Lolipop).
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
})
