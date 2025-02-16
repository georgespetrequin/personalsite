import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 3000,
    open: true // opens browser automatically
  },
  build: {
    outDir: 'dist',
    minify: true
  },
  resolve: {
    alias: {
      '@': '/src' // allows you to use @ to reference the src directory
    }
  }
}) 