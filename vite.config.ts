import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/dcct-hta-dashboard/',
  plugins: [react()],
})
