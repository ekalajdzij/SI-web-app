import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      'x': {
        target: 'http://si-web-app_dotnet_backend_1:8080', 
        changeOrigin: true, // Opcija da se promijeni origin zahtjeva
        secure: false, 
      },
    },
    build: {
      outDir: 'dist'
    },
    host: true
  },
});
