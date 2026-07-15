import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import pkg from './package.json';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Isso cria a variável e injeta apenas o texto da versão no código
    'import.meta.env.PACKAGE_VERSION': JSON.stringify(pkg.version),
  },
})
