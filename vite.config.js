import { defineConfig } from 'vite'
import blogPlugin from './blog/plugins/vite-plugin-blog'

export default defineConfig({
  server: {
    port: 3000,
    open: true // opens browser automatically
  },
  build: {
    outDir: 'dist',
    minify: true,
    rollupOptions: {
      input: {
        main: 'index.html',
        blog: 'blog/index.html'
      }
    }
  },
  resolve: {
    alias: {
      '@': '/src' // allows you to use @ to reference the src directory
    }
  },
  plugins: [blogPlugin()]
}) 