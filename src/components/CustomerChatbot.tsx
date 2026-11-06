import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  ChevronDown, 
  RefreshCw, 
  ShieldCheck, 
  ExternalLink,
  Phone,
  Image as ImageIcon,
  CheckCircle2,
  HelpCircle,
  ShoppingBag
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Product, StoreSettings } from '../types';
import { AdminImageStudio } from './AdminImageStudio';

interface Message {
  id: string;
  role: 'assistant' | 'user';
  text: string;
  timestamp: string;
  suggestedProducts?: Product[];
}

interface CustomerChatbotProps {
  products: Product[];
  settings: StoreSettings;
  onSelectProduct?: (product: Product) => void;
  onProductUpdated?: (product: Product) => void;
}

export const CustomerChatbot: React.FC<CustomerChatbotProps> = ({
  products,
  settings,
  onSelectProduct,
  onProductUpdated,
}) => {
  const { isAdmin } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'admin-images'>('chat');
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Initialize welcome message once
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome-1',
          role: 'assistant',
          text: `As-salamu alaykum! Welcome to **Digital Product Pakistan** 🇵🇰\n\nI am your official AI Assistant powered by Gemini. Ask me anything about:\n- **Software & Tools available** in stock\n- Exact live PKR prices (ChatGPT Pro, Gemini Pro, WhatsApp Bulk SMS Sender, CapCut Pro, ElevenLabs, Canva Panel)\n- How to order directly on **WhatsApp (+92 310 7759274)**\n- How to pay via **Easypaisa (03010333544)**\n- Instant digital delivery & activation assistance!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  }, []);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (isOpen && activeTab === 'chat') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, activeTab, isLoading]);

  // Quick prompt presets
  const quickPrompts = [
    'What software & tools are available right now?',
    'What is the price of ChatGPT Pro & Gemini Pro?',
    'Tell me about WhatsApp Bulk SMS Sender (18 features)',
    'How do I order directly on WhatsApp?',
    'How do I pay with Easypaisa (03010333544)?',
  ];

  // Get most up-to-date live products from local storage snapshot or props
  const getLiveProductsSnapshot = (): Product[] => {
    try {
      const cached = localStorage.getItem('dpp_custom_products');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {}
    return products;
  };

  // Helper to match specific product from user text
  const matchSpecificProduct = (text: string, prods: Product[]): Product | null => {
    const t = text.toLowerCase();
    if (t.includes('chatgpt') || t.includes('chat gpt') || t.includes('gpt')) {
      return prods.find(p => p.id === 'prod-chatgpt-pro') || prods.find(p => p.title.toLowerCase().includes('chatgpt')) || null;
    }
    if (t.includes('gemini')) {
      return prods.find(p => p.id === 'prod-gemini-pro') || prods.find(p => p.title.toLowerCase().includes('gemini')) || null;
    }
    if (t.includes('whatsapp') || t.includes('sender') || t.includes('bulk sms')) {
      return prods.find(p => p.id === 'prod-whatsapp-bulk-sender') || prods.find(p => p.id === 'prod-whatsapp-sender') || prods.find(p => p.title.toLowerCase().includes('whatsapp')) || null;
    }
    if (t.includes('notion')) {
      return prods.find(p => p.id === 'prod-notion-plus') || prods.find(p => p.title.toLowerCase().includes('notion')) || null;
    }
    if (t.includes('microsoft') || t.includes('365') || t.includes('office') || t.includes('onedrive')) {
      return prods.find(p => p.id === 'prod-ms-365') || prods.find(p => p.title.toLowerCase().includes('microsoft')) || null;
    }
    if (t.includes('capcut team') || (t.includes('capcut') && t.includes('team'))) {
      return prods.find(p => p.id === 'prod-capcut-team') || null;
    }
    if (t.includes('capcut')) {
      return prods.find(p => p.id === 'prod-capcut-pro') || null;
    }
    if (t.includes('elevenlabs') || t.includes('eleven') || t.includes('voice')) {
      return prods.find(p => p.id === 'prod-elevenlabs') || prods.find(p => p.title.toLowerCase().includes('elevenlabs')) || null;
    }
    if (t.includes('canva pro') || (t.includes('canva') && t.includes('mail'))) {
      return prods.find(p => p.id === 'prod-canva-pro-mail') || prods.find(p => p.title.toLowerCase().includes('canva pro')) || null;
    }
    if (t.includes('canva')) {
      return prods.find(p => p.id === 'prod-canva-panel-500') || prods.find(p => p.title.toLowerCase().includes('canva panel')) || prods.find(p => p.title.toLowerCase().includes('canva')) || null;
    }
    if (t.includes('coursera')) {
      return prods.find(p => p.id === 'prod-coursera-private') || prods.find(p => p.title.toLowerCase().includes('coursera')) || null;
    }
    if (t.includes('sales navigator') || t.includes('sales nav')) {
      return prods.find(p => p.id === 'prod-linkedin-sales-nav-2m') || prods.find(p => p.title.toLowerCase().includes('sales navigator')) || null;
    }
    if (t.includes('linkedin')) {
      if (t.includes('sales')) {
        return prods.find(p => p.id === 'prod-linkedin-sales-nav-2m') || null;
      }
      return prods.find(p => p.id === 'prod-linkedin-career-3m') || prods.find(p => p.title.toLowerCase().includes('linkedin')) || null;
    }
    if (t.includes('udemy')) {
      return prods.find(p => p.id === 'prod-udemy-personal-1m') || prods.find(p => p.title.toLowerCase().includes('udemy')) || null;
    }
    if (t.includes('claude') || t.includes('anthropic')) {
      return prods.find(p => p.id === 'prod-claude-api-500') || prods.find(p => p.title.toLowerCase().includes('claude')) || null;
    }
    if (t.includes('proxy') || t.includes('owl')) {
      return prods.find(p => p.id === 'prod-owl-proxy-200mb') || prods.find(p => p.title.toLowerCase().includes('owl')) || null;
    }
    if (t.includes('windows') || t.includes('win 10') || t.includes('win 11') || t.includes('win pro')) {
      return prods.find(p => p.id === 'prod-windows-pro-license') || prods.find(p => p.title.toLowerCase().includes('windows')) || null;
    }
    if (t.includes('adobe') || t.includes('express')) {
      return prods.find(p => p.id === 'prod-adobe-express-12m') || prods.find(p => p.title.toLowerCase().includes('adobe express')) || null;
    }
    if (t.includes('proton')) {
      return prods.find(p => p.id === 'prod-proton-vpn-1m') || prods.find(p => p.title.toLowerCase().includes('proton')) || null;
    }
    if (t.includes('course pro') || (t.includes('course') && !t.includes('capcut') && !t.includes('coursera') && !t.includes('udemy'))) {
      return prods.find(p => p.id === 'prod-course-pro-1year') || prods.find(p => p.title.toLowerCase().includes('course pro')) || null;
    }
    if (t.includes('nordvpn') || t.includes('nord')) {
      return prods.find(p => p.id === 'prod-nordvpn-private') || prods.find(p => p.title.toLowerCase().includes('nord')) || null;
    }
    if (t.includes('surfshark') || t.includes('surf')) {
      return prods.find(p => p.id === 'prod-surfshark-vpn-private') || prods.find(p => p.title.toLowerCase().includes('surfshark')) || null;
    }
    if (t.includes('netflix')) {
      return prods.find(p => p.id === 'prod-netflix-1m') || prods.find(p => p.title.toLowerCase().includes('netflix')) || null;
    }
    if (t.includes('prime') || t.includes('amazon')) {
      if (t.includes('6') || t.includes('six') || t.includes('half')) {
        return prods.find(p => p.id === 'prod-amazon-prime-6m') || prods.find(p => p.title.toLowerCase().includes('6 month')) || null;
      }
      return prods.find(p => p.id === 'prod-amazon-prime-1m') || prods.find(p => p.title.toLowerCase().includes('1 month')) || prods.find(p => p.title.toLowerCase().includes('prime')) || null;
    }
    if (t.includes('proton') || t.includes('hma') || t.includes('vpn')) {
      if (t.includes('proton')) return prods.find(p => p.id === 'prod-proton-vpn-1m') || null;
      if (t.includes('surf')) return prods.find(p => p.id === 'prod-surfshark-vpn-private') || null;
      if (t.includes('nord')) return prods.find(p => p.id === 'prod-nordvpn-private') || null;
      return prods.find(p => p.id === 'prod-hma-vpn') || prods.find(p => p.id === 'prod-nordvpn-private') || prods.find(p => p.title.toLowerCase().includes('vpn')) || null;
    }
    if (t.includes('outlook') || t.includes('mail')) {
      return prods.find(p => p.id === 'prod-outlook-mail-trust') || prods.find(p => p.id === 'prod-outlook-mail') || prods.find(p => p.title.toLowerCase().includes('outlook')) || null;
    }
    if (t.includes('duolingo') || t.includes('super duo')) {
      return prods.find(p => p.id === 'prod-super-duolingo') || prods.find(p => p.title.toLowerCase().includes('duolingo')) || null;
    }
    return null;
  };

  // Helper to match mentioned products in response
  const detectProductsInText = (text: string, currentProds: Product[]): Product[] => {
    const published = currentProds.filter(p => p.status === 'published');
    const matched: Product[] = [];
    for (const prod of published) {
      const titleLower = prod.title.toLowerCase();
      // Look for significant keywords from title
      const keywords = titleLower.split(' ').filter(w => w.length > 3);
      const matchesKeyword = keywords.some(k => text.toLowerCase().includes(k));
      if (text.toLowerCase().includes(titleLower) || matchesKeyword) {
        if (!matched.some(m => m.id === prod.id)) {
          matched.push(prod);
        }
      }
    }
    return matched.slice(0, 3);
  };

  // Send message to Gemini server endpoint
  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || isLoading) return;

    const liveProducts = getLiveProductsSnapshot();

    const userMsg: Message = {
      id: 'usr-' + Date.now(),
      role: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          history: messages.slice(-5).map(m => ({ role: m.role === 'user' ? 'user' : 'model', content: m.text })),
          catalog: {
            products: liveProducts.map(p => ({
              id: p.id,
              title: p.title,
              pricePKR: Number(p.pricePKR),
              category: p.category,
              status: p.status,
              fileType: p.productType,
              features: p.features,
              shortDescription: p.shortDescription || p.description?.slice(0, 150),
            })),
            settings: {
              storeName: settings.businessName || 'Digital Product Pakistan',
              whatsappNumber: settings.whatsappNumber || '+923107759274',
              easypaisaNumber: settings.easypaisaNumber || '03010333544',
              supportEmail: settings.supportEmail || 'support@digitalproductpakistan.com',
            },
          },
          isAdmin,
        }),
      });

      if (!response.ok) {
        throw new Error('Server returned ' + response.status);
      }

      const data = await response.json();
      let replyText = data.reply || "Thank you for asking! How else may I assist your digital purchase today?";
      
      // Auto-reconcile live price verification if a specific product was queried
      const queriedProd = matchSpecificProduct(query, liveProducts);
      if (queriedProd) {
        const queryLower = query.toLowerCase();
        const isPriceAsk = queryLower.includes('price') || queryLower.includes('rate') || queryLower.includes('kitne') || queryLower.includes('kitna') || queryLower.includes('cost') || queryLower.includes('pkr');
        const formattedPrice = Number(queriedProd.pricePKR).toLocaleString();
        if (isPriceAsk && !replyText.includes(formattedPrice)) {
          replyText += `\n\n📌 **Verified Live Price:** **${queriedProd.title}** is currently **Rs. ${formattedPrice} PKR** (updated live from our store panel).`;
        }
      }

      const detectedProds = detectProductsInText(replyText, liveProducts);
      if (queriedProd && !detectedProds.some(p => p.id === queriedProd.id)) {
        detectedProds.unshift(queriedProd);
      }

      const assistantMsg: Message = {
        id: 'ast-' + Date.now(),
        role: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedProducts: detectedProds.length > 0 ? detectedProds.slice(0, 3) : undefined,
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      console.warn('Chat using live catalog fallback:', err);
      const lower = query.toLowerCase();
      let fallbackText = '';
      
      const isPriceQuery = lower.includes('price') || lower.includes('cost') || lower.includes('rate') || lower.includes('kitne') || lower.includes('kitna') || lower.includes('pkr') || lower.includes('rupay') || lower.includes('rupee') || lower.includes('fee');
      const matchedProd = matchSpecificProduct(query, liveProducts);

      if (matchedProd && isPriceQuery) {
        fallbackText = `The current live price for **${matchedProd.title}** is **Rs. ${Number(matchedProd.pricePKR).toLocaleString()} PKR**.\n\n• **Status:** ${matchedProd.status === 'published' ? '✅ In Stock & Ready for Instant Delivery' : '⏳ In Update / Draft'}\n• **Delivery:** Within 15–30 minutes directly to your WhatsApp\n• **Payment:** Easypaisa to \`${settings.easypaisaNumber || '03010333544'}\` (Account Title: MUHAMMAD KUMAIL ALI)\n• **WhatsApp Direct Order:** Click the button below or message **${settings.whatsappNumber || '+92 310 7759274'}**`;
      } else if (matchedProd) {
        fallbackText = `**${matchedProd.title}** is available in our store for **Rs. ${Number(matchedProd.pricePKR).toLocaleString()} PKR**.\n\n${matchedProd.shortDescription || matchedProd.description?.slice(0, 160)}\n\n• **Delivery:** Delivered within 15–30 minutes directly to WhatsApp\n• **Order Directly:** Message Muhammad Kumail Ali on WhatsApp at **${settings.whatsappNumber || '+92 310 7759274'}**`;
      } else if (isPriceQuery || lower.includes('available') || lower.includes('product') || lower.includes('catalog') || lower.includes('kya')) {
        const available = liveProducts.filter(p => p.status === 'published');
        fallbackText = `Here are the latest live prices updated in our Admin Panel:\n\n` +
          available.map(p => `• **${p.title}** — **Rs. ${Number(p.pricePKR).toLocaleString()} PKR** (${p.productType === 'software' ? 'Software' : 'Tool'})`).join('\n') +
          `\n\nAll items are delivered directly to your WhatsApp within 15–30 minutes upon Easypaisa payment verification.`;
      } else if (lower.includes('easypaisa') || lower.includes('pay') || lower.includes('payment')) {
        fallbackText = `### Easypaisa Payment Guide:\n1. Open your Easypaisa app and transfer the exact PKR amount to:\n   - **Account Number:** \`${settings.easypaisaNumber || '03010333544'}\`\n   - **Account Title:** MUHAMMAD KUMAIL ALI\n2. Share your Transaction Screenshot & TRX ID on WhatsApp at **${settings.whatsappNumber || '+92 310 7759274'}**.\n3. Verified and delivered within 15–30 minutes!`;
      } else {
        fallbackText = `I am here to help you with live software prices, Easypaisa payments, and direct WhatsApp activation! You can also message founder **Muhammad Kumail Ali** directly on WhatsApp at **${settings.whatsappNumber || '+92 310 7759274'}**.`;
      }

      const detectedProds = detectProductsInText(fallbackText, liveProducts);
      if (matchedProd && !detectedProds.some(p => p.id === matchedProd.id)) {
        detectedProds.unshift(matchedProd);
      }

      setMessages(prev => [
        ...prev,
        {
          id: 'ast-' + Date.now(),
          role: 'assistant',
          text: fallbackText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestedProducts: detectedProds.length > 0 ? detectedProds.slice(0, 3) : undefined,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* FLOATING LAUNCHER BUTTON - Compact & Non-Obstructive on Mobile */}
      {!isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex items-center gap-2">
          <button
            onClick={() => setIsOpen(true)}
            aria-label="Open AI Assistant"
            className="group relative flex items-center justify-center gap-2 bg-[#B7F34A] hover:bg-[#a6e03f] text-[#111C18] font-black text-xs sm:text-sm w-11 h-11 sm:w-auto sm:h-auto sm:px-4 sm:py-2.5 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer border border-[#c4f866]"
            title="Ask DPP AI Assistant about availability and prices"
          >
            <div className="relative shrink-0">
              <Sparkles className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#111C18]" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-600 rounded-full animate-ping" />
            </div>
            <span className="hidden sm:inline">Ask DPP AI</span>
            {isAdmin && (
              <span className="hidden sm:inline bg-[#111C18] text-[#B7F34A] text-[9px] font-extrabold px-1.5 py-0.5 rounded-full uppercase ml-0.5">
                Admin
              </span>
            )}
          </button>
        </div>
      )}

      {/* CHATBOT DRAWER / MODAL */}
      {isOpen && (
        <div className="fixed inset-y-0 right-0 sm:inset-auto sm:bottom-6 sm:right-6 z-50 w-full sm:w-[480px] lg:w-[540px] max-w-full bg-[#111C18] border border-[#233730] sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 sm:max-h-[88vh]">
          {/* HEADER */}
          <div className="bg-[#15231F] border-b border-[#233730] p-4 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#B7F34A]/20 border border-[#B7F34A]/40 flex items-center justify-center text-[#B7F34A]">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-black text-white">DPP AI Assistant</h3>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] text-emerald-400 font-bold uppercase">Online</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Product Availability, Easypaisa & Delivery Guide
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setMessages([messages[0]])}
                  title="Clear chat"
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#1E3029] transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  title="Close Assistant"
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#1E3029] transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* ADMIN ONLY TAB SWITCHER */}
            {isAdmin && (
              <div className="mt-2 pt-2 border-t border-[#233730] flex items-center justify-between">
                <div className="flex bg-[#111C18] p-1 rounded-xl border border-[#233730] w-full">
                  <button
                    onClick={() => setActiveTab('chat')}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                      activeTab === 'chat'
                        ? 'bg-[#B7F34A] text-[#111C18]'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    Customer Chat
                  </button>
                  <button
                    onClick={() => setActiveTab('admin-images')}
                    className={`flex-1 py-1.5 text-xs font-black rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                      activeTab === 'admin-images'
                        ? 'bg-[#B7F34A] text-[#111C18]'
                        : 'text-[#B7F34A] hover:text-white'
                    }`}
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    👑 Image Studio (Admin Only)
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* BODY: TAB 1 (CHAT) OR TAB 2 (ADMIN IMAGE STUDIO) */}
          {activeTab === 'chat' ? (
            <div className="flex-1 flex flex-col overflow-hidden min-h-0">
              {/* MESSAGES SCROLL AREA */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {m.role === 'assistant' && (
                      <div className="w-7 h-7 rounded-lg bg-[#15231F] border border-[#233730] flex items-center justify-center text-[#B7F34A] shrink-0 mt-0.5">
                        <Bot className="w-4 h-4" />
                      </div>
                    )}

                    <div
                      className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed space-y-2 ${
                        m.role === 'user'
                          ? 'bg-[#B7F34A] text-[#111C18] font-medium rounded-tr-none'
                          : 'bg-[#15231F] border border-[#233730] text-slate-200 rounded-tl-none shadow-md'
                      }`}
                    >
                      <div className="whitespace-pre-line">
                        {m.text}
                      </div>

                      {/* Display suggested product chips if detected */}
                      {m.suggestedProducts && m.suggestedProducts.length > 0 && (
                        <div className="pt-2 border-t border-[#233730]/60 space-y-1.5">
                          <span className="text-[10px] font-bold text-[#B7F34A] uppercase tracking-wider block">
                            Mentioned in Store Catalog:
                          </span>
                          <div className="space-y-1.5">
                            {m.suggestedProducts.map((p) => (
                              <div
                                key={p.id}
                                className="bg-[#111C18] border border-[#233730] hover:border-[#B7F34A]/50 rounded-xl p-2 flex items-center justify-between gap-2 transition-colors"
                              >
                                <div className="min-w-0">
                                  <p className="font-bold text-white truncate text-[11px]">{p.title}</p>
                                  <span className="text-[#B7F34A] font-extrabold text-[10px]">
                                    PKR {p.pricePKR.toLocaleString()}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1.5 shrink-0">
                                  <a
                                    href={`https://wa.me/923107759274?text=${encodeURIComponent(`Salam! I want to order *${p.title}* (PKR ${p.pricePKR.toLocaleString()}) from Digital Product Pakistan.`)}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="bg-[#25D366] hover:bg-[#20ba59] text-white text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1"
                                    title="Order on WhatsApp"
                                  >
                                    <Phone className="w-2.5 h-2.5" />
                                    <span>WhatsApp</span>
                                  </a>
                                  {onSelectProduct && (
                                    <button
                                      onClick={() => {
                                        onSelectProduct(p);
                                        setIsOpen(false);
                                      }}
                                      className="bg-[#B7F34A] text-[#111C18] text-[10px] font-bold px-2 py-1 rounded-lg cursor-pointer"
                                    >
                                      View
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <span
                        className={`text-[9px] block text-right pt-0.5 ${
                          m.role === 'user' ? 'text-black/60' : 'text-slate-500'
                        }`}
                      >
                        {m.timestamp}
                      </span>
                    </div>

                    {m.role === 'user' && (
                      <div className="w-7 h-7 rounded-lg bg-[#B7F34A] text-[#111C18] flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                        U
                      </div>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="flex gap-3 justify-start">
                    <div className="w-7 h-7 rounded-lg bg-[#15231F] border border-[#233730] flex items-center justify-center text-[#B7F34A] shrink-0">
                      <Bot className="w-4 h-4 animate-spin" />
                    </div>
                    <div className="bg-[#15231F] border border-[#233730] rounded-2xl rounded-tl-none p-3.5 text-xs text-slate-300 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-[#B7F34A] rounded-full animate-bounce" />
                      <span className="w-1.5 h-1.5 bg-[#B7F34A] rounded-full animate-bounce [animation-delay:0.2s]" />
                      <span className="w-1.5 h-1.5 bg-[#B7F34A] rounded-full animate-bounce [animation-delay:0.4s]" />
                      <span className="text-slate-400 text-[11px] ml-1">Checking catalog with Gemini...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* QUICK PROMPT SUGGESTION CHIPS */}
              <div className="px-3 py-2 bg-[#15231F]/50 border-t border-[#233730] overflow-x-auto flex items-center gap-1.5 no-scrollbar">
                {quickPrompts.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(q)}
                    className="whitespace-nowrap bg-[#15231F] hover:bg-[#1E3029] border border-[#233730] hover:border-[#B7F34A]/40 text-slate-300 hover:text-white text-[11px] px-3 py-1.5 rounded-full transition-colors cursor-pointer shrink-0"
                  >
                    {q}
                  </button>
                ))}
              </div>

              {/* INPUT BAR */}
              <div className="p-3 bg-[#15231F] border-t border-[#233730]">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Ask about products, availability, or Easypaisa..."
                    className="flex-1 bg-[#111C18] border border-[#233730] focus:border-[#B7F34A] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={!inputMessage.trim() || isLoading}
                    className="bg-[#B7F34A] hover:bg-[#a6e03f] text-[#111C18] p-2.5 rounded-xl disabled:opacity-40 cursor-pointer transition-all shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>

                {/* ESCALATION FOOTER */}
                <div className="mt-2 pt-2 border-t border-[#233730]/50 flex items-center justify-between text-[10px] text-slate-400">
                  <span>Owner: Muhammad Kumail Ali</span>
                  <a
                    href={`https://wa.me/${(settings.whatsappNumber || '+923455282215').replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hello Muhammad Kumail Ali, I have a question regarding Digital Product Pakistan.')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#B7F34A] hover:underline flex items-center gap-1 font-bold"
                  >
                    <Phone className="w-3 h-3" />
                    WhatsApp Support
                  </a>
                </div>
              </div>
            </div>
          ) : (
            /* TAB 2: ADMIN IMAGE STUDIO (ADMIN EXCLUSIVE) */
            <div className="flex-1 overflow-y-auto p-4 bg-[#111C18]">
              <AdminImageStudio
                products={products}
                onProductUpdated={onProductUpdated}
              />
            </div>
          )}
        </div>
      )}
    </>
  );
};
