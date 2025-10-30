import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Разрешаем доступ со всех IP
    port: 5173,
    strictPort: true, // Не менять порт если занят
    // Для HTTPS (опционально)
    // https: true,
  },
  // Для правильного определения адресов в приложении
  define: {
    'process.env': {},
  },
});
