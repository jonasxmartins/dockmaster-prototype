import path from "path"
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import type { Plugin } from 'vite'

// Load .env into process.env so api/scope.ts can read OPENAI_API_KEY when run via ssrLoadModule
const envDir = path.resolve(__dirname)
Object.assign(process.env, loadEnv(process.env.MODE ?? 'development', envDir, ''))

function apiPlugin(): Plugin {
  return {
    name: 'api-scope',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url === '/api/scope' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk: Buffer) => { body += chunk.toString(); });
          req.on('end', async () => {
            try {
              const request = new Request('http://localhost/api/scope', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body,
              });
              const mod = await server.ssrLoadModule('/api/scope.ts');
              const response: Response = await mod.default(request);
              res.statusCode = response.status;
              response.headers.forEach((value, key) => {
                res.setHeader(key, value);
              });
              const text = await response.text();
              res.end(text);
            } catch (e: unknown) {
              res.statusCode = 500;
              const message = e instanceof Error ? e.message : String(e);
              const stack = e instanceof Error ? e.stack : undefined;
              console.error('[api/scope]', message, stack ?? '');
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: message }));
            }
          });
          return;
        }
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), apiPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
