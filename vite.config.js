import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: {
    proxy: {
      // Vite serves no functions of its own, so /api goes to the local runtime
      // in scripts/dev-api.mjs (`npm run dev:api`). In production Vercel routes
      // /api itself and this block is not used.
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: false,
      },
    },
  },
})
