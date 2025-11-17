import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png', 'LOGORN.png'],
      injectRegister: false,
      pwaAssets: {
        disabled: false,
        config: true,
      },
      manifest: {
        name: 'Resep Nusantara',
        short_name: 'Resep Nusantara',
        description: 'Aplikasi Resep Makanan dan Minuman Khas Indonesia',
        theme_color: '#2563eb',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        orientation: 'portrait',
        icons: [
          {
            src: '/pwa-64x64.png',
            sizes: '64x64',
            type: 'image/png'
          },
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },
      workbox: {
        // Menambahkan format gambar ke globPatterns
        globPatterns: ['**/*.{js,css,html,svg,png,ico,jpg,jpeg,webp}'], 
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        
        // Konfigurasi Runtime Caching
        runtimeCaching: [
          {
            // Caching untuk API Resep (NetworkFirst: coba jaringan dulu, jika gagal ambil dari cache)
            urlPattern: /^https:\/\/modlima\.fuadfakhruz\.id\/api\/v1\/recipes/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-recipes',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 5 * 60, // 5 minutes
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            // Caching untuk semua gambar (CacheFirst: ambil dari cache dulu, jika tidak ada baru dari jaringan)
            urlPattern: /\.(jpg|jpeg|png|gif|webp|svg)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images',
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
              },
            },
          },
        ],
      },
      devOptions: {
        enabled: false,
        navigateFallback: 'index.html',
        suppressWarnings: true,
        type: 'module',
      },
    })
  ],
});