import { defineConfig } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig({
  base: './',
  build: {
    outDir: 'docs'
  },
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: '.nojekyll',
          dest: '.'
        }
      ]
    })
  ]
})
