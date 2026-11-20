import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  root: 'src',
  publicDir: '../public',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
        reglamento: resolve(__dirname, 'src/reglamento.html'),
        politicaDatos: resolve(__dirname, 'src/politica-de-datos.html'),
        menores: resolve(__dirname, 'src/ingreso-menores.html'),
        bienvenida: resolve(__dirname, 'src/carta-de-bienvenida.html')
      }
    }
  },
  server: {
    port: 3000,
    open: true
  },
  preview: {
    port: 4173
  }
})
