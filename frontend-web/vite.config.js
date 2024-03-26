import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://fieldlogistics-control.azurewebsites.net', // Ciljani URL
        changeOrigin: true, // Opcija da se promijeni origin zahtjeva
        secure: false, // Ako je ciljani server na HTTPS, postavite na true
        // rewrite: (path) => path.replace(/^\/api/, '') // Ako trebate ukloniti /api dio puta
      },
    },
  },
});
