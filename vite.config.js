import { resolve } from 'path'
import { defineConfig } from 'vite'

const root = resolve(__dirname, 'site')

export default defineConfig({
  root,
  build: {
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main:        resolve(root, 'index.html'),
        en:          resolve(root, 'en/index.html'),
        impressum:   resolve(root, 'impressum/index.html'),
        datenschutz: resolve(root, 'datenschutz/index.html'),
      }
    }
  }
})
