import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/arxiv': {
        target: 'https://export.arxiv.org',
        changeOrigin: true,
        rewrite: (path) => {
          const url = new URL(path, 'http://localhost')
          const params = url.searchParams
          return `/api/query?${params.toString()}&sortBy=submittedDate&sortOrder=descending`
        },
      },
    },
  },
})
