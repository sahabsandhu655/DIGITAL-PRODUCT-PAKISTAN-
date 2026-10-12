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
          text: `As-salamu alaykum! Welcome to **Digital Product Pakistan** 🇵🇰\n\nI am your official AI Assistant powered by Gemini. Ask me anything about:\n- **What products are currently available** in stock\n- Pricing, course outlines, and software licenses\n- How to pay via **Easypaisa / JazzCash**\n- Instant digital delivery to your Email & WhatsApp!`,
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
    'What products are available right now?',
    'How do I pay with Easypaisa?',
    'Do you have programming & IT courses?',
    'How does digital delivery work?',
    'What is your return & refund policy?',
  ];

  // Helper to match mentioned products in response
  const detectProductsInText = (text: string): Product[] => {
    const published = products.filter(p => p.status === 'published');
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
            products: products.map(p => ({
              id: p.id,
              title: p.title,
              pricePKR: p.pricePKR,
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
      const replyText = data.reply || "Thank you for asking! How else may I assist your digital purchase today?";
      const detectedProds = detectProductsInText(replyText);

      const assistantMsg: Message = {
        id: 'ast-' + Date.now(),
        role: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedProducts: detectedProds.length > 0 ? detectedProds : undefined,
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      console.warn('Chat error:', err);
      // Resilient fallback logic if server error occurs
      const lower = query.toLowerCase();
      let fallbackText = '';
      if (lower.includes('available') || lower.includes('product') || lower.includes('course') || lower.includes('kya')) {
        const available = products.filter(p => p.status === 'published');
        fallbackText = `Here are the top digital products currently available in our catalog:\n\n` +
          available.map(p => `• **${p.title}** — PKR ${Number(p.pricePKR).toLocaleString()} (${p.category.toUpperCase()})`).join('\n') +
          `\n\nAll items include **instant Google Drive access** upon Easypaisa payment verification.`;
      } else if (lower.includes('easypaisa') || lower.includes('pay') || lower.includes('payment')) {
        fallbackText = `### Easypaisa Payment Guide:\n1. Open your Easypaisa app and send the exact total to:\n   - **Account Number:** \`${settings.easypaisaNumber || '03010333544'}\`\n   - **Account Title:** Muhammad Kumail Ali\n2. At checkout, upload your Transaction Screenshot and TRX ID.\n3. Verified within minutes!`;
      } else {
        fallbackText = `I am here to help you with all questions regarding Digital Product Pakistan products, Easypaisa payments, and instant delivery! For direct questions, you can also reach founder **Muhammad Kumail Ali** on WhatsApp at **${settings.whatsappNumber || '+923107759274'}**.`;
      }

      setMessages(prev => [
        ...prev,
        {
          id: 'ast-' + Date.now(),
          role: 'assistant',
          text: fallbackText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* FLOATING LAUNCHER BUTTON */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
          <button
            onClick={() => setIsOpen(true)}
            aria-label="Open AI Assistant"
            className="group relative flex items-center gap-2.5 bg-[#B7F34A] hover:bg-[#a6e03f] text-[#111C18] font-black text-sm px-4 sm:px-5 py-3 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer border border-[#c4f866]"
          >
            <div className="relative">
              <Sparkles className="w-5 h-5 text-[#111C18] animate-pulse" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-600 rounded-full animate-ping" />
            </div>
            <span>Ask DPP AI</span>
            {isAdmin && (
              <span className="bg-[#111C18] text-[#B7F34A] text-[10px] font-extrabold px-1.5 py-0.5 rounded-full uppercase ml-1">
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
                                {onSelectProduct && (
                                  <button
                                    onClick={() => {
                                      onSelectProduct(p);
                                      setIsOpen(false);
                                    }}
                                    className="bg-[#B7F34A] text-[#111C18] text-[10px] font-bold px-2.5 py-1 rounded-lg shrink-0 cursor-pointer"
                                  >
                                    View
                                  </button>
                                )}
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
