import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/fluoro-app/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      filename: 'sw2.js',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [],
        skipWaiting: true,
        clientsClaim: true,
        cleanupOutdatedCaches: true,
        navigateFallback: '/fluoro-app/index.html',
      },
      manifest: {
        name: 'FluoroPath',
        short_name: 'FluoroPath',
        description: 'California Fluoroscopy Exam Prep',
        theme_color: '#0D7377',
        background_color: '#F8F9FA',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/fluoro-app/',
        icons: [
          {
            src: '/fluoro-app/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/fluoro-app/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
  server: {
    host: true,
  },
})
