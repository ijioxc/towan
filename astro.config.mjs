// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  outDir: '../table',
  site: 'https://towan.com.tw',
  // 正式站根目錄用 '/'(預設);preview 子目錄 build 時設 BASE_PATH=/preview/
  base: process.env.BASE_PATH || '/',
  server: {
    port: process.env.PORT ? Number(process.env.PORT) : 4321,
  },
  vite: {
    plugins: [tailwindcss()]
  }
});