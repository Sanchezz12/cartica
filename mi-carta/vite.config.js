import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'docs',   // 👈 aquí le decimos que genere la carpeta docs
  },
  base: './',         // 👈 importante para GitHub Pages
})
