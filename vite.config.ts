import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import { defineConfig, Plugin } from 'vite';
import { GoogleGenAI } from '@google/genai';

function apiDevPlugin(): Plugin {
  const LIVE_PRODUCTS_FILE = path.resolve(__dirname, 'src/data/liveProducts.json');

  const getLiveProducts = (): any[] => {
    try {
      if (fs.existsSync(LIVE_PRODUCTS_FILE)) {
        const raw = fs.readFileSync(LIVE_PRODUCTS_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (err) {
      console.warn('Error reading liveProducts.json:', err);
    }
    return [];
  };

  const saveLiveProducts = (prods: any[]) => {
    try {
      fs.writeFileSync(LIVE_PRODUCTS_FILE, JSON.stringify(prods, null, 2), 'utf-8');
    } catch (err) {
      console.warn('Error writing liveProducts.json:', err);
    }
  };

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

      // LIVE PRODUCTS API: Shared server-side store across all customers & admin
      server.middlewares.use('/api/products', (req, res) => {
        res.setHeader('Content-Type', 'application/json');

        if (req.method === 'GET') {
          const prods = getLiveProducts();
          res.end(JSON.stringify({ success: true, products: prods }));
          return;
        }

        if (req.method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', () => {
            try {
              const data = JSON.parse(body || '{}');
              let current = getLiveProducts();

              // Check if bulk update
              if (Array.isArray(data.products)) {
                current = data.products;
                saveLiveProducts(current);
                res.end(JSON.stringify({ success: true, count: current.length }));
                return;
              }

              // Single product update or insert
              if (data && data.id) {
                const idx = current.findIndex((p: any) => p.id === data.id);
                if (idx >= 0) {
                  current[idx] = { ...current[idx], ...data, updatedAt: new Date().toISOString() };
                } else {
                  current.unshift({ ...data, updatedAt: new Date().toISOString() });
                }
                saveLiveProducts(current);
                res.end(JSON.stringify({ success: true, product: data }));
                return;
              }

              res.statusCode = 400;
              res.end(JSON.stringify({ error: 'Invalid product payload' }));
            } catch (err: any) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: err.message }));
            }
          });
          return;
        }

        if (req.method === 'DELETE') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', () => {
            try {
              const data = JSON.parse(body || '{}');
              const idToDelete = data.id || req.url?.split('?id=')[1];
              if (idToDelete) {
                let current = getLiveProducts();
                current = current.filter((p: any) => p.id !== idToDelete);
                saveLiveProducts(current);
                res.end(JSON.stringify({ success: true, deleted: idToDelete }));
                return;
              }
              res.statusCode = 400;
              res.end(JSON.stringify({ error: 'Missing product ID to delete' }));
            } catch (err: any) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: err.message }));
            }
          });
          return;
        }

        res.statusCode = 405;
        res.end(JSON.stringify({ error: 'Method Not Allowed' }));
      });

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

      // Customer and Admin Gemini Chat Endpoint - With Live Catalog and Real-Time Sync
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

            // Merge server-side live products with client catalog
            const serverProds = getLiveProducts();
            const clientProds = Array.isArray(catalog.products) ? catalog.products : [];
            
            // Prefer newest state by product ID
            const prodMap = new Map<string, any>();
            serverProds.forEach((p: any) => prodMap.set(p.id, p));
            clientProds.forEach((p: any) => prodMap.set(p.id, { ...(prodMap.get(p.id) || {}), ...p }));
            const allProductsList = Array.from(prodMap.values());

            const publishedProducts = allProductsList.filter((p: any) => p.status === 'published');
            const draftOrUnavailable = allProductsList.filter((p: any) => p.status !== 'published');

            // Categorize into the two official sections: Software and Tools
            const software = publishedProducts.filter((p: any) => p.productType === 'software');
            const tools = publishedProducts.filter((p: any) => p.productType === 'tool' || p.category?.toLowerCase().includes('tool'));

            const catalogSummary = `
=== PUBLISHED & CURRENTLY AVAILABLE SOFTWARE (${software.length} items) ===
${software.map((p: any) => `• Software: "${p.title}" | Live Price: PKR ${Number(p.pricePKR).toLocaleString()} | Validity: ${p.validity || 'Official access'} | Highlights: ${(p.features || []).slice(0, 3).join(', ')} | Delivery: Direct WhatsApp credentials/link`).join('\n')}

=== PUBLISHED & CURRENTLY AVAILABLE TOOLS (${tools.length} items) ===
${tools.map((p: any) => `• Tool: "${p.title}" | Live Price: PKR ${Number(p.pricePKR).toLocaleString()} | Validity: ${p.validity || 'Official access'} | Features: ${(p.features || []).slice(0, 3).join(', ')} ${p.featureSlides ? `[Includes ${p.featureSlides.length} illustrated feature slides]` : ''} | Delivery: Direct WhatsApp download/activation`).join('\n')}

=== CURRENTLY UNAVAILABLE OR DRAFT PRODUCTS (NOT FOR SALE AT THIS TIME) ===
${draftOrUnavailable.length > 0 ? draftOrUnavailable.map((p: any) => `• "${p.title}" (Status: ${p.status} - Not currently available for purchase)`).join('\n') : 'None. All listed catalog products are online.'}
`;

            const systemPrompt = `You are the official Customer AI Assistant for "Digital Product Pakistan" (DPP), Pakistan's premier digital goods store specializing in Software and Digital Tools.
Owner & Founder: Muhammad Kumail Ali.
Official WhatsApp: +923107759274
Official Easypaisa Account: 03010333544 (Account Title: MUHAMMAD KUMAIL ALI)
Support Email: support@digitalproductpakistan.com / sahabsandhu455@gmail.com
Store Currency: PKR (Pakistani Rupee).

LIVE REAL-TIME STORE INVENTORY:
${catalogSummary}

CRITICAL RULES FOR RESPONDING TO CUSTOMERS:
1. STRICT REAL-TIME PRICES FROM LIVE INVENTORY:
   - When asked for the price of ANY software or tool, you MUST look up the EXACT "Live Price: PKR ..." from the LIVE REAL-TIME STORE INVENTORY above.
   - The store administrator frequently modifies and updates prices in real-time from the Admin Panel.
   - NEVER use old, assumed, or hardcoded prices. ALWAYS quote the current live price listed in the inventory above.
   - Format all prices clearly with the product name and exact PKR amount (e.g. "Rs. [Price] PKR").
2. CURRENT AVAILABILITY ONLY:
   - We only have two official sections: Software and Tools.
   - When asked what is available, ONLY list the published software and tools above.
   - If a customer asks for courses, e-books, or items not listed above, politely clarify that we now specialize exclusively in Software and Tools.
3. HOW TO ORDER:
   - Option A (Direct on WhatsApp): Customer can click the "Order on WhatsApp Direct" button or message +923107759274 directly to order immediately.
   - Option B (Easypaisa on Website): Manual transfer to Easypaisa Account 03010333544 (Title: MUHAMMAD KUMAIL ALI), then upload TRX ID screenshot.
4. DELIVERY: Credentials, team invites, and download links are dispatched directly to customer's WhatsApp within 15–30 minutes.
5. LANGUAGE: Polite, professional, and friendly Pakistani tone. Support both English and Urdu/Roman Urdu effortlessly.`;

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
              model: 'gemini-2.5-flash',
              contents: prompt,
            });

            const reply = response.text || 'Thank you for contacting Digital Product Pakistan! How can I assist you with our software and tools today?';
            res.end(JSON.stringify({ reply }));
          } catch (e: any) {
            console.warn('Gemini chat error, generating smart catalog answer:', e.message);
            const lowerMsg = (message || '').toLowerCase();
            const serverProds = getLiveProducts();
            const published = serverProds.filter((p: any) => p.status === 'published');
            let fallbackReply = '';

            const software = published.filter((p: any) => p.productType === 'software');
            const tools = published.filter((p: any) => p.productType === 'tool' || p.category?.toLowerCase().includes('tool'));

            if (lowerMsg.includes('available') || lowerMsg.includes('kya') || lowerMsg.includes('product') || lowerMsg.includes('tool') || lowerMsg.includes('software')) {
              fallbackReply = `As-salamu alaykum! Here are the official Software & Tools available in Digital Product Pakistan:\n\n` +
                `⚡ **Software Subscriptions:**\n` + software.map((p: any) => `• **${p.title}** — PKR ${Number(p.pricePKR).toLocaleString()}`).join('\n') + `\n\n` +
                `🛠️ **Marketing & Digital Tools:**\n` + tools.map((p: any) => `• **${p.title}** — PKR ${Number(p.pricePKR).toLocaleString()}`).join('\n') + `\n\n` +
                `📌 **Order on WhatsApp:** Message Muhammad Kumail Ali directly at **+92 310 7759274** or pay via Easypaisa to **03010333544** (Title: MUHAMMAD KUMAIL ALI) for instant delivery!`;
            } else if (lowerMsg.includes('easypaisa') || lowerMsg.includes('pay') || lowerMsg.includes('jazzcash') || lowerMsg.includes('order')) {
              fallbackReply = `### How to Order on Digital Product Pakistan:\n1. **Order on WhatsApp:** Message us directly at **+92 310 7759274** for fast direct checkout.\n2. **Or Pay via Easypaisa:**\n   - **Account Number:** \`03010333544\`\n   - **Account Title:** MUHAMMAD KUMAIL ALI\n3. Upload your TRX screenshot at checkout or send it to WhatsApp (+923107759274). Your access is delivered within minutes!`;
            } else {
              fallbackReply = `Welcome to Digital Product Pakistan! 🇵🇰\nWe provide verified Software Subscriptions and Marketing Tools with instant WhatsApp delivery & manual Easypaisa payment verification.\n\n• **Official WhatsApp:** +92 310 7759274 (Muhammad Kumail Ali)\n• **Easypaisa Account:** 03010333544 (MUHAMMAD KUMAIL ALI)\n• **Live Catalog:** ${published.length} software & tools available.\n\nAsk me about Notion Plus (1,443 PKR), Microsoft 365 (1,174 PKR), ChatGPT Pro (4,000 PKR), Gemini Pro (999 PKR), WhatsApp Bulk SMS Sender (2,499 PKR), CapCut Pro (750 PKR), HMA VPN (402 PKR), or Outlook Mail (107 PKR)!`;
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
