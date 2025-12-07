import path from 'node:path'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [TanStackRouterVite(), react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        // Manual chunking function for code splitting by category
        manualChunks(id: string) {
          // Vendor chunks
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor'
            }
            if (id.includes('@tanstack')) {
              return 'tanstack-vendor'
            }
            return 'vendor'
          }
          
          // Animation category chunks
          if (id.includes('src/lib/animations/')) {
            if (id.includes('particles/')) return 'animations-particles'
            if (id.includes('waves/')) return 'animations-waves'
            if (id.includes('geometric/')) return 'animations-geometric'
            if (id.includes('glitch/')) return 'animations-glitch'
            if (id.includes('text/')) return 'animations-text'
          }
        },
      },
    },
    chunkSizeWarningLimit: 600,
    sourcemap: false,
    minify: 'terser',
  },
  // Performance optimizations
  optimizeDeps: {
    include: ['react', 'react-dom', '@tanstack/react-router', '@tanstack/react-store'],
    exclude: ['@tanstack/router-devtools'],
  },
})