import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default ({ mode }) => defineConfig({
  base: loadEnv(mode, 'env').VITE_APP_URL,
  envDir: 'env',
  publicDir: 'public',    // 静态资源目录（图片/CSS/JS等）
  build: {
    outDir: 'dist',       // 构建输出目录（HTML等）
    emptyOutDir: true     // 构建前清空目录
  },
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('src', import.meta.url))
    },
  },
})
