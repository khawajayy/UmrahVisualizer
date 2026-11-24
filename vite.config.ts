import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // Relative base so the build works at any path (e.g. GitHub Pages /UmrahVisualizer/). Routing is hash-based.
  base: './',
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          motion: ['framer-motion'],
          map: ['leaflet', 'react-leaflet'],
        },
      },
    },
  },
})
