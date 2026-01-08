import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const api_url = process.env.API_URL || 'http://localhost:8080';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    strictPort: true,
    proxy: {
      '/api': {
        target: api_url,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), // Removes /api before sending to Go
      },
    }
  },
})
