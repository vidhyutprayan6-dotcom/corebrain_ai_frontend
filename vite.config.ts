import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiOrigin = (() => {
    try {
      return env.VITE_API_URL ? new URL(env.VITE_API_URL).origin : ''
    } catch {
      return ''
    }
  })()

  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'inject-api-preconnect',
        transformIndexHtml(html) {
          if (!apiOrigin) {
            return html
          }

          return html.replace(
            '<meta name="viewport"',
            `<link rel="preconnect" href="${apiOrigin}" crossorigin />\n    <meta name="viewport"`,
          )
        },
      },
    ],
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules/react-router') || id.includes('node_modules/react-dom')) {
              return 'vendor'
            }

            if (id.includes('node_modules/react/')) {
              return 'vendor'
            }

            if (id.includes('/src/components/dashboard/') || id.includes('/src/pages/AppPage')) {
              return 'dashboard'
            }

            if (id.includes('/src/pages/') || id.includes('/src/components/AuthLayout')) {
              return 'auth'
            }
          },
        },
      },
    },
    server: {
      port: 7000,
      strictPort: true,
      host: true,
      open: true,
      proxy: {
        '/api': {
          target: 'http://localhost:3001',
          changeOrigin: true,
        },
      },
    },
    preview: {
      port: 4173,
      strictPort: true,
      host: true,
      proxy: {
        '/api': {
          target: 'http://localhost:3001',
          changeOrigin: true,
        },
      },
    },
  }
})
