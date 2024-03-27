import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://fieldlogistics-control.azurewebsites.net', 
        changeOrigin: true, // Opcija da se promijeni origin zahtjeva
        secure: false, 
      },
    },
    build: {
      outDir: 'build'
    }
  },
});
