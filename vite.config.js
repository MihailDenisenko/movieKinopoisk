import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
  define: {
    'process.env': {},
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    // Важно для SPA на Vercel
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  // Для правильных путей на Vercel
  base: './',
});
