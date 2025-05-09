import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: "/task-manager-frontend",

  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://task-manager-backend-xj6y.onrender.com',
        changeOrigin: true,
      }
    }
  }
})
