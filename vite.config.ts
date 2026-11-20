import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { publicPageFiles } from './vite-pages.ts'

export default defineConfig({
  plugins: [
    react(),
    publicPageFiles(),
    {
      name: 'development-robots',
      apply: 'serve',
      transformIndexHtml() {
        return [{ tag: 'meta', attrs: { name: 'robots', content: 'noindex, nofollow' } }]
      },
    },
  ],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    allowedHosts: ['preview.coreeyegroup.com'],
    hmr: {
      host: 'preview.coreeyegroup.com',
      protocol: 'wss',
      clientPort: 443,
    },
  },
})
