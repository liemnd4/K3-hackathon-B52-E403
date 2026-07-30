import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  server: {
    fs: {
      // Cho phép Vite serve file ngoài thư mục codebase/ (để truy cập data/vlearn-pack/slides/)
      allow: ['..'],
    },
  },
})
