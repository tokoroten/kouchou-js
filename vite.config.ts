import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// デバッグ情報を表示
console.log('Vite設定ファイル読み込み');
console.log('Node.js バージョン:', process.version);
console.log('プロセス環境:', {
  NODE_ENV: process.env.NODE_ENV,
  BASE_URL: process.env.BASE_URL,
});

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react()],
  server: {
    // 詳細なログ出力
    hmr: { overlay: true },
  },
  build: {
    sourcemap: true,
  },
  logLevel: 'info',
})
