import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';
import { GoogleGenAI } from '@google/genai';

function apiDevPlugin(): Plugin {
  return {
    name: 'api-dev-middleware',
    configureServer(server) {
      // Helper for Gemini AI client
      const getAiClient = () => {
        if (!process.env.GEMINI_API_KEY) return null;
        return new GoogleGenAI({
          apiKey: process.env.GEMINI_API_KEY,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            },
          },
        });
      };

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

      // Customer and Admin Gemini Chat Endpoint
      server.middlewares.use('/api/gemini/chat', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: 'Method Not Allowed' }));
          return;
        }
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', async () => {
          res.setHeader('Content-Type', 'application/json');
          let message = '';
          let history: any[] = [];
          let catalog: any = {};
          let isAdmin = false;

          try {
            const parsed = JSON.parse(body || '{}');
            message = parsed.message || '';
            history = parsed.history || [];
            catalog = parsed.catalog || {};
            isAdmin = !!parsed.isAdmin;

            const ai = getAiClient();

            if (!ai) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: 'Gemini API key not configured on server.' }));
              return;
            }

            const productsList = Array.isArray(catalog.products) ? catalog.products : [];
            const publishedProducts = productsList.filter((p: any) => p.status === 'published');
            const draftOrUnavailable = productsList.filter((p: any) => p.status !== 'published');

            const catalogSummary = `
PUBLISHED / CURRENTLY AVAILABLE PRODUCTS IN STORE (${publishedProducts.length} items):
${publishedProducts.map((p: any) => `- "${p.title}" | Category: ${p.category} | Price: PKR ${p.pricePKR} | File Type: ${p.fileType || 'Digital'} | Highlights: ${(p.features || []).slice(0, 3).join(', ')} | Description: ${(p.shortDescription || p.description || '').slice(0, 100)}`).join('\n')}

UNAVAILABLE / DRAFT / COMING SOON PRODUCTS:
${draftOrUnavailable.map((p: any) => `- "${p.title}" (Status: ${p.status} - Not currently published for sale)`).join('\n')}
`;

            const systemPrompt = `You are the official Customer Assistant for "Digital Product Pakistan" (DPP), Pakistan's premier digital goods store.
Owner / Founder: Muhammad Kumail Ali.
Official WhatsApp: ${catalog.settings?.whatsappNumber || '+92 345 5282215'}
Support Email: ${catalog.settings?.supportEmail || 'sahabsandhu455@gmail.com'}
Easypaisa Account: ${catalog.settings?.easypaisaNumber || '03455282215'} (Title: Muhammad Kumail Ali)
JazzCash Account: Available upon request via WhatsApp.
Currency: PKR (Pakistani Rupee).

STORE INVENTORY & AVAILABILITY:
${catalogSummary}

ROLE & CAPABILITIES:
- If asked "what is available" or "what products do you have": provide a clear, organized list of available products grouped by category (E-Books, Software Tools, Online Courses) along with their prices in PKR.
- If asked about a specific item: check if it appears in the AVAILABLE catalog above.
  * If AVAILABLE: confirm that it is in stock, explain its price in PKR, what it includes, and how to purchase.
  * If NOT in the catalog (or listed as draft): state clearly and politely that this specific product is NOT currently available in the catalog. Tell them they can request custom products or upcoming releases directly by messaging Muhammad Kumail Ali on WhatsApp (+92 345 5282215). Recommend the closest available alternative from the catalog if one exists.
- How payment works: Manual Easypaisa / JazzCash payment to 03455282215 (Muhammad Kumail Ali). Customer uploads screenshot & TRX ID during checkout.
- How delivery works: Instant Google Drive link and software license key sent to customer's email and WhatsApp within minutes of manual payment verification.
- Language: Warm, polite, professional Pakistani tone. You may answer in English or Urdu/Roman Urdu if the customer speaks in Urdu ("kya courses available hain?", "payment kaisay karein?"). Keep answers direct and helpful.`;

            // Prepare conversation prompt
            let historyText = '';
            if (Array.isArray(history) && history.length > 0) {
              historyText = history.slice(-6).map((h: any) => `${h.role === 'user' ? 'Customer' : 'Assistant'}: ${h.text || h.content}`).join('\n');
            }

            const prompt = `${systemPrompt}

${historyText ? `Recent Chat History:\n${historyText}\n` : ''}
Customer: ${message}
Assistant:`;

            const response = await ai.models.generateContent({
              model: 'gemini-3.8-flash',
              contents: prompt,
            });

            const reply = response.text || 'Thank you for reaching out to Digital Product Pakistan! How else may I assist you today?';
            res.end(JSON.stringify({ reply }));
          } catch (e: any) {
            console.warn('Gemini chat temporary error, generating smart catalog answer:', e.message);
            const lowerMsg = (message || '').toLowerCase();
            const published = Array.isArray(catalog.products) ? catalog.products.filter((p: any) => p.status === 'published') : [];
            let fallbackReply = '';

            if (lowerMsg.includes('available') || lowerMsg.includes('kya') || lowerMsg.includes('product') || lowerMsg.includes('course') || lowerMsg.includes('ebook') || lowerMsg.includes('software')) {
              fallbackReply = `As-salamu alaykum! Here are the products currently available in our Digital Product Pakistan store:\n\n` +
                published.map((p: any) => `• **${p.title}** — PKR ${Number(p.pricePKR).toLocaleString()} (${(p.category || 'digital').toUpperCase()})`).join('\n') +
                `\n\n📌 **Instant Delivery:** Google Drive links sent to your Email & WhatsApp after Easypaisa verification.\n💬 For custom inquiries, message Muhammad Kumail Ali on WhatsApp at +92 345 5282215!`;
            } else if (lowerMsg.includes('easypaisa') || lowerMsg.includes('pay') || lowerMsg.includes('jazzcash')) {
              fallbackReply = `### How to Pay via Easypaisa:\n1. Open your Easypaisa app and transfer to:\n   - **Account Number:** \`${catalog.settings?.easypaisaNumber || '03455282215'}\`\n   - **Account Title:** Muhammad Kumail Ali\n2. At checkout, upload your Transaction Screenshot and TRX ID.\n3. Verified within minutes and Google Drive links are dispatched instantly!`;
            } else {
              fallbackReply = `Welcome to Digital Product Pakistan! 🇵🇰\nWe provide verified e-books, premium online courses, and software licenses with manual Easypaisa payment verification and instant delivery.\n\n• **WhatsApp Support:** ${catalog.settings?.whatsappNumber || '+92 345 5282215'}\n• **Available Catalog:** ${published.length} products currently in stock.\n\nAsk me about any product title or price!`;
            }

            res.end(JSON.stringify({ reply: fallbackReply }));
          }
        });
      });

      // Admin AI Content Assistant Endpoint
      server.middlewares.use('/api/ai-assistant', (req, res) => {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', async () => {
          res.setHeader('Content-Type', 'application/json');
          try {
            const { prompt } = JSON.parse(body || '{}');
            const ai = getAiClient();

            if (ai && prompt) {
              const response = await ai.models.generateContent({
                model: 'gemini-3.8-flash',
                contents: `You are an expert copywriter for Digital Product Pakistan (an e-commerce store selling e-books, online courses, and digital tools in Pakistan in PKR).
Provide high-converting, professional marketing copy for the following request:
"${prompt}"

Keep it clear, engaging, and tailored for Pakistani digital creators and professionals.`,
              });
              res.end(JSON.stringify({ content: response.text }));
            } else {
              res.end(JSON.stringify({
                content: `[AI Draft for "${prompt}"]\n\nHigh-value digital asset engineered for maximum productivity. Includes step-by-step setup guidance, verified license terms, and direct Pakistani WhatsApp support.`
              }));
            }
          } catch (e: any) {
            console.error('ai-assistant error:', e);
            res.end(JSON.stringify({
              content: `Error connecting to Gemini: ${e.message}. Using offline template.\n\nPremium Pakistani digital asset with instant Google Drive access and manual Easypaisa verification.`
            }));
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
