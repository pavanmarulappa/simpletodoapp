import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Update API URL during build if needed
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
})

