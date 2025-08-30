import { defineConfig } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig({
  base: '/cartica/', // 👈 usa el nombre exacto del repo
  build: {
    outDir: 'dist', // 👈 si usas docs, GitHub Pages lo detecta fácil
  },
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: '.nojekyll', // 👈 evita problemas con archivos estáticos
          dest: '.'
        }
      ]
    })
  ]
})
