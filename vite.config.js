import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'https://nfc-backend-8z7z.onrender.com',
      '/ws': {
        target: 'ws://localhost:3000',
        ws: true
      }
    }
  }
})