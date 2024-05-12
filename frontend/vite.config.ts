import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { compression } from 'vite-plugin-compression2';

// TODO add compression

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    compression({ algorithm: 'gzip', exclude: [/\.(br)$ /, /\.(gz)$/], deleteOriginalAssets: false }),
    compression({ algorithm: 'brotliCompress', exclude: [/\.(br)$ /, /\.(gz)$/], deleteOriginalAssets: false })
  ],
  build: {
    minify: true,
    rollupOptions: {
      input: {
        landing: 'index.html',
        singup: './pages/signup.html',
        login: './pages/login.html',
        dashboard: './pages/dashboard.html',
        trip: './pages/trip.html'
      },
    }
  }
})
