import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

import vue from '@vitejs/plugin-vue';
import VueDevTools from 'vite-plugin-vue-devtools';
import basicSsl from '@vitejs/plugin-basic-ssl';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 5059
  },
  plugins: [
    basicSsl(),
    vue(),
    VueDevTools(),
    VitePWA({
      registerType: 'prompt',
      devOptions: {
        enabled: true,
        suppressWarnings: true
      },
      manifest: {
        name: 'QuickText',
        short_name: 'QuickText',
        description:
          'QuickText is a simple text editor that allows you to quickly write and save text.',
        theme_color: '#2d2a33',
        background_color: '#161516',
        display: 'standalone',
        icons: [
          {
            src: 'icons/android-chrome-512x512.png',
            sizes: '512x512', // multiple sizes
            type: 'image/png'
          }
        ],
        share_target: {
          action: '/share',
          method: 'GET',
          params: {
            title: 'title',
            text: 'text',
            url: 'url'
          }
        }
      }
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
});
