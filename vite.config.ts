import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, Plugin} from 'vite';

function apiDevPlugin(): Plugin {
  return {
    name: 'api-dev-middleware',
    configureServer(server) {
      server.middlewares.use('/api/create-order', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: 'Method Not Allowed' }));
          return;
        }
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
          try {
            const data = JSON.parse(body || '{}');
            const total = (data.items || []).reduce((sum: number, it: any) => sum + (Number(it.pricePKR) || 0) * (it.quantity || 1), 0);
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
              success: true,
              order: {
                ...data,
                totalPKR: total,
                paymentStatus: 'Payment Proof Submitted',
                orderStatus: 'Pending Verification',
                deliveryStatus: 'Awaiting Payment',
              }
            }));
          } catch (e: any) {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: e.message }));
          }
        });
      });

      server.middlewares.use('/api/upload-proof', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: true, message: 'Proof verified.' }));
      });

      server.middlewares.use('/api/ai-assistant', (req, res) => {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
          try {
            const { prompt } = JSON.parse(body || '{}');
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
              content: `[AI Draft for "${prompt}"]\n\nHigh-value digital asset engineered for maximum productivity. Includes step-by-step setup guidance, verified license terms, and direct Pakistani WhatsApp support.`
            }));
          } catch (e) {
            res.end(JSON.stringify({ content: 'AI draft generated.' }));
          }
        });
      });
    }
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), apiDevPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
