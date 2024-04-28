import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// TODO add compression

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    minify: true,
    rollupOptions: {
      input: {
        landing: 'index.html',
        singup: './pages/signup.html',
        login: './pages/login.html'
      },
    }
  }
})
