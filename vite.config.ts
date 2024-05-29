import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'

export default defineConfig({
  plugins: [
    vue(),
    VueI18nPlugin({
      include: ['@/locales/**']
    })
  ],
  server: {
    host: true,
    port: 3000
  },
  resolve: {
    alias: [{ find: '@', replacement: '/src' }]
  }
})
