import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import { createContactHandler } from './api/contact.js'

export default defineConfig(({ mode }) => {
  // Only the server middleware receives these values. Vite never injects them into the client.
  const env = { ...process.env, ...loadEnv(mode, process.cwd(), '') }
  const handler = createContactHandler(env)
  return {
    plugins: [react(), {
      name: 'private-contact-api',
      configureServer(server) {
        server.middlewares.use((request, response, next) => {
          if (request.url?.split('?')[0] === '/api/contact') void handler(request, response)
          else next()
        })
      },
    }],
  }
})
