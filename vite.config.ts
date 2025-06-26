import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 👇 VERY IMPORTANT: Set to the name of your GitHub repo
export default defineConfig({
  plugins: [react()],
  base: '/TasteOfHome/'  // ✅ THIS FIXES THE 404 PATH ISSUE
})
