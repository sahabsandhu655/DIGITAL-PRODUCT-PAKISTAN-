import React, { useState } from 'react';
import { 
  ArrowRight, 
  Search, 
  Cpu, 
  ShieldCheck, 
  Clock, 
  CheckCircle, 
  CheckCircle2,
  Sparkles,
  MessageCircle,
  HelpCircle,
  Phone,
  Layers,
  Newspaper,
  Zap,
  Users,
  Send,
  Download,
  Calendar,
  ChevronRight
} from 'lucide-react';
import { Product, BlogPost } from '../types';
import { ProductCard } from '../components/ProductCard';

interface HomePageProps {
  products: Product[];
  blogPosts: BlogPost[];
  onSelectProduct: (product: Product) => void;
  onSelectBlog: (blog: BlogPost) => void;
  onNavigate: (route: string) => void;
}

const RELATED_KEYWORDS = [
  { label: 'ChatGPT Pro Pakistan', query: 'ChatGPT' },
  { label: 'WhatsApp Bulk SMS Sender', query: 'WhatsApp' },
  { label: 'Gemini Pro 18-Month', query: 'Gemini' },
  { label: 'CapCut Pro Easypaisa', query: 'CapCut' },
  { label: 'Notion Plus 12 Month', query: 'Notion' },
  { label: 'Microsoft 365 1TB', query: 'Microsoft' },
  { label: 'ElevenLabs Voice AI', query: 'ElevenLabs' },
  { label: 'Canva 500-User Panel', query: 'Canva' },
  { label: 'HMA VPN Pakistan', query: 'HMA VPN' },
  { label: 'Outlook Mail Trust', query: 'Outlook' },
  { label: 'Super Duolingo Cheap', query: 'Duolingo' },
  { label: 'Software with Easypaisa', query: 'Software' },
];

const WHATSAPP_SENDER_FEATURES = [
  { title: 'Anti-Ban Human Delay Engine', desc: 'Configurable 5-15s random delays prevent algorithm detection.' },
  { title: 'Excel / CSV 1-Click Importer', desc: 'Import 50,000+ Pakistani phone numbers with name & city tags.' },
  { title: 'Group Member Auto-Extractor', desc: 'Extract active customer numbers from any niche WhatsApp group in 1-click.' },
  { title: 'Dynamic {name} Personalization', desc: 'Greet each client by name: "Salam {name}, special discount for you".' },
  { title: 'Rich Media Attachments', desc: 'Send HD brochures, price PDFs, demo videos, and product catalogs.' },
  { title: 'Multi-Account Number Rotation', desc: 'Rotate across multiple SIM numbers to balance sending volume.' },
  { title: 'Zero Monthly Recurring Fees', desc: 'One-time PKR 2,499 purchase with lifetime software ownership.' },
  { title: 'Real-Time Delivery Analytics', desc: 'Export full Excel reports of sent, delivered, and replied campaigns.' },
];

export const HomePage: React.FC<HomePageProps> = ({
  products,
  blogPosts,
  onSelectProduct,
  onSelectBlog,
  onNavigate,
}) => {
  const [heroSearch, setHeroSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'software' | 'tools'>('all');

  const publishedProducts = products.filter(p => p.status === 'published');
  
  // Two Main Sections: Software & Tools
  const softwareProducts = publishedProducts.filter(p => p.productType === 'software');
  const toolProducts = publishedProducts.filter(p => p.productType === 'tool');

  const filteredProducts = publishedProducts.filter(p => {
    const matchesSearch = heroSearch.trim() === '' || 
      p.title.toLowerCase().includes(heroSearch.toLowerCase()) ||
      p.description.toLowerCase().includes(heroSearch.toLowerCase()) ||
      (p.tags && p.tags.some(t => t.toLowerCase().includes(heroSearch.toLowerCase())));

    if (!matchesSearch) return false;
    if (activeTab === 'software') return p.productType === 'software';
    if (activeTab === 'tools') return p.productType === 'tool';
    return true;
  });

  const whatsappDisplay = '+92 310 7759274';
  const whatsappUrl = 'https://wa.me/923107759274?text=Salam%20Muhammad%20Kumail%20Ali!%20I%20want%20to%20order%20from%20Digital%20Product%20Pakistan.';

  const handleKeywordClick = (query: string) => {
    setHeroSearch(query);
    const el = document.getElementById('catalog-sections');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-16 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#111C18] via-[#15231F] to-[#111C18] pt-10 sm:pt-14 pb-16 sm:pb-20 border-b border-[#233730]">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#B7F34A_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Trust Badge */}
          <div className="inline-flex items-center gap-2 bg-[#1A2924] border border-[#25D366]/40 px-3.5 py-1 rounded-full text-xs font-semibold text-[#25D366] mb-5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
            <span>Official Digital Subscriptions & Tools • Direct WhatsApp: {whatsappDisplay}</span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
            Premium Software & Tools. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B7F34A] via-[#DFF5D5] to-[#B7F34A]">
              Delivered Direct to WhatsApp.
            </span>
          </h1>

          {/* Subtitle with High-Intent SEO Sentences */}
          <p className="mt-4 sm:mt-5 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Pakistan's verified digital store for instant activation of ChatGPT Pro, Gemini Pro, WhatsApp Bulk SMS Sender, Notion Plus, Microsoft 365, CapCut Pro, ElevenLabs, Canva Panel, HMA VPN, and Super Duolingo with manual Easypaisa verification.
          </p>

          {/* Quick Contact & WhatsApp Order Strip */}
          <div className="mt-6 sm:mt-7 flex flex-wrap items-center justify-center gap-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="bg-[#25D366] hover:bg-[#20ba59] text-white font-extrabold text-xs sm:text-sm px-5 sm:px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg shadow-[#25D366]/20 active:scale-95 transition-all"
            >
              <MessageCircle className="w-4 h-4 fill-white/20" />
              <span>Order on WhatsApp ({whatsappDisplay})</span>
            </a>

            <button
              onClick={() => {
                const el = document.getElementById('catalog-sections');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-[#1A2924] hover:bg-[#233730] text-white border border-[#233730] font-bold text-xs sm:text-sm px-5 py-3 rounded-xl transition-all cursor-pointer"
            >
              Browse Catalog
            </button>
          </div>

          {/* Search bar */}
          <div className="mt-8 max-w-xl mx-auto">
            <div className="relative flex items-center">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
              <input
                type="text"
                value={heroSearch}
                onChange={(e) => setHeroSearch(e.target.value)}
                placeholder="Search ChatGPT, Notion, Microsoft 365, CapCut, WhatsApp Sender, VPN..."
                className="w-full bg-[#162420] border-2 border-[#233730] focus:border-[#B7F34A] text-white placeholder-slate-400 text-sm rounded-2xl py-3 pl-12 pr-4 focus:outline-none transition-all shadow-xl shadow-black/40"
              />
              {heroSearch && (
                <button
                  onClick={() => setHeroSearch('')}
                  className="absolute right-3.5 text-xs text-slate-400 hover:text-white bg-[#1A2924] px-2 py-1 rounded-md cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* RELATED KEYWORD SEARCH CLOUD (For #1 Google Ranking & Fast Discovery) */}
          <div className="mt-6 max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 font-semibold mb-2.5">
              <Sparkles className="w-3.5 h-3.5 text-[#B7F34A]" />
              <span>Popular Searches in Pakistan:</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
              {RELATED_KEYWORDS.map((k) => (
                <button
                  key={k.label}
                  onClick={() => handleKeywordClick(k.query)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                    heroSearch.toLowerCase() === k.query.toLowerCase()
                      ? 'bg-[#B7F34A] text-[#111C18] border-[#B7F34A] font-bold shadow-sm'
                      : 'bg-[#15231F] text-slate-300 border-[#233730] hover:border-[#B7F34A]/50 hover:text-white'
                  }`}
                >
                  {k.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* QUICK STATS & DIRECT WHATSAPP BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#15231F] border border-[#233730] rounded-2xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#25D366]/10 text-[#25D366] flex items-center justify-center shrink-0">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-400 block">Instant Chat & Orders</span>
              <a 
                href={whatsappUrl} 
                target="_blank" 
                rel="noreferrer" 
                className="font-bold text-white hover:text-[#25D366] transition-colors text-sm"
              >
                {whatsappDisplay}
              </a>
              <p className="text-[11px] text-slate-400">Click to message Muhammad Kumail Ali</p>
            </div>
          </div>

          <div className="bg-[#15231F] border border-[#233730] rounded-2xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#B7F34A]/10 text-[#B7F34A] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-400 block">Manual Easypaisa Verification</span>
              <span className="font-bold text-white text-sm">03010333544</span>
              <p className="text-[11px] text-slate-400">Title: MUHAMMAD KUMAIL ALI</p>
            </div>
          </div>

          <div className="bg-[#15231F] border border-[#233730] rounded-2xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-400 block">Fast Fulfillment</span>
              <span className="font-bold text-white text-sm">Within 15–30 Minutes</span>
              <p className="text-[11px] text-slate-400">Sent directly to your WhatsApp & Email</p>
            </div>
          </div>
        </div>
      </section>

      {/* CATALOG FILTERS & TABS */}
      <section id="catalog-sections" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#233730] pb-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Official Products Catalog
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Showing active software licenses and digital tools available for immediate order.
            </p>
          </div>

          {/* Section Filter Tabs */}
          <div className="flex items-center gap-2 bg-[#15231F] border border-[#233730] p-1 rounded-xl self-start sm:self-auto">
            <button
              onClick={() => setActiveTab('all')}
              className={`text-xs font-bold px-3.5 py-2 rounded-lg transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-[#B7F34A] text-[#111C18] shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Items ({publishedProducts.length})
            </button>
            <button
              onClick={() => setActiveTab('software')}
              className={`text-xs font-bold px-3.5 py-2 rounded-lg transition-all cursor-pointer ${
                activeTab === 'software'
                  ? 'bg-[#B7F34A] text-[#111C18] shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Software ({softwareProducts.length})
            </button>
            <button
              onClick={() => setActiveTab('tools')}
              className={`text-xs font-bold px-3.5 py-2 rounded-lg transition-all cursor-pointer ${
                activeTab === 'tools'
                  ? 'bg-[#B7F34A] text-[#111C18] shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Tools ({toolProducts.length})
            </button>
          </div>
        </div>

        {/* SECTION 1: SOFTWARE */}
        {(activeTab === 'all' || activeTab === 'software') && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#B7F34A]/10 text-[#B7F34A] flex items-center justify-center">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white">
                    Software Subscriptions
                  </h3>
                  <p className="text-xs text-slate-400">
                    ChatGPT Pro, Gemini Pro, Notion Plus, Microsoft 365, CapCut Pro individual & team, ElevenLabs, HMA VPN, Outlook Mail, and Super Duolingo
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(activeTab === 'software' ? filteredProducts : softwareProducts).map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelect={onSelectProduct}
                />
              ))}
            </div>
          </div>
        )}

        {/* SECTION 2: TOOLS */}
        {(activeTab === 'all' || activeTab === 'tools') && (
          <div className="space-y-6 pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#25D366]/10 text-[#25D366] flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white">
                    Digital & Marketing Tools
                  </h3>
                  <p className="text-xs text-slate-400">
                    WhatsApp Bulk SMS Sender (5-image interactive showcase) and Canva Admin Reseller Panel
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
              {(activeTab === 'tools' ? filteredProducts : toolProducts).map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelect={onSelectProduct}
                />
              ))}
            </div>
          </div>
        )}
      </section>

      {/* WHATSAPP BULK SMS SENDER SPECIAL FEATURE SPOTLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#15231F] via-[#1A2E28] to-[#15231F] border-2 border-[#25D366]/30 rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-2xl">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 bg-[#25D366]/10 border border-[#25D366]/40 px-3 py-1 rounded-full text-xs font-bold text-[#25D366]">
              <Send className="w-3.5 h-3.5" />
              <span>Flagship Marketing Software — 10 Dedicated In-Depth Guides</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              WhatsApp Bulk SMS Sender: <br className="hidden sm:inline" />
              <span className="text-[#25D366]">Skyrocket Your Business In Pakistan</span>
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Reach thousands of qualified local customers in Lahore, Karachi, Islamabad, and across Pakistan with zero per-message charges. Built specifically with modern anti-ban algorithms, Excel batch uploading, and personalized greetings.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            {WHATSAPP_SENDER_FEATURES.map((feat, idx) => (
              <div key={idx} className="bg-[#111C18]/80 border border-[#233730] hover:border-[#25D366]/50 rounded-2xl p-4 transition-all space-y-1.5">
                <div className="flex items-center gap-2 text-[#25D366]">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <h4 className="font-bold text-white text-xs">{feat.title}</h4>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed pl-6">{feat.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-[#233730] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-0.5">
              <span className="text-xs text-slate-400">One-Time Lifetime License Price</span>
              <div className="text-xl sm:text-2xl font-black text-[#B7F34A]">
                Rs. 2,499 PKR <span className="text-xs text-slate-400 font-normal line-through ml-2">Rs. 4,999</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2.5">
              <a
                href="https://wa.me/923107759274?text=Salam%20Muhammad%20Kumail%20Ali!%20I%20want%20to%20order%20WhatsApp%20Bulk%20SMS%20Sender%20for%20Rs.%202,499%20PKR."
                target="_blank"
                rel="noreferrer"
                className="bg-[#25D366] hover:bg-[#20ba59] text-white font-extrabold text-xs px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-md shadow-[#25D366]/20 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Order on WhatsApp Now</span>
              </a>

              <button
                onClick={() => onNavigate('blog-index')}
                className="bg-[#1A2924] hover:bg-[#233730] text-slate-200 border border-[#233730] text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <Newspaper className="w-3.5 h-3.5 text-[#B7F34A]" />
                <span>Read 10 WhatsApp Guides</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE DIGITAL PRODUCT PAKISTAN (INTERACTIVE TRUST & FAQ SECTION) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <span className="text-xs font-bold text-[#B7F34A] uppercase tracking-wider block">
            Trust & Reliability
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
            Why Choose Digital Product Pakistan?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            The #1 trusted store for Pakistani professionals, agencies, students, and freelancers who need reliable digital tools without international card hassles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#15231F] border border-[#233730] rounded-3xl p-6 sm:p-8 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#B7F34A]/10 text-[#B7F34A] flex items-center justify-center font-bold">
              1
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white">
              Zero International Card Taxes & No SBP Blockages
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Pakistani bank debit and credit cards (Nayapay, Sadapay, Meezan, HBL, MCB) frequently decline on international platforms like OpenAI, Anthropic, or Notion, or charge up to 14% withholding taxes. Digital Product Pakistan allows you to pay straightforwardly in PKR via Easypaisa with zero additional bank surcharges.
            </p>
          </div>

          <div className="bg-[#15231F] border border-[#233730] rounded-3xl p-6 sm:p-8 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#25D366]/10 text-[#25D366] flex items-center justify-center font-bold">
              2
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white">
              100% Genuine Private Accounts & Official Licenses
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Avoid fraudulent social media sellers who put hundreds of people on one shared cookie. We deliver verified private subscriptions, authentic Microsoft 365 1TB OneDrive cloud storage keys, and legitimate Notion Plus accounts that protect your privacy and personal data.
            </p>
          </div>

          <div className="bg-[#15231F] border border-[#233730] rounded-3xl p-6 sm:p-8 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold">
              3
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white">
              15–30 Minute Direct WhatsApp Delivery by Muhammad Kumail Ali
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              No waiting days for fulfillment. As soon as you confirm your Easypaisa payment with our official merchant line at <strong>03107759274</strong>, our team verifies the TRX ID and delivers your access details directly to your phone.
            </p>
          </div>

          <div className="bg-[#15231F] border border-[#233730] rounded-3xl p-6 sm:p-8 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
              4
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white">
              Full Validity Replacement Guarantee & Local Support
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              We stand behind every single product. If any account runs into an issue during its subscription duration, you have direct WhatsApp access to our founder for immediate replacement or renewal assistance.
            </p>
          </div>
        </div>
      </section>

      {/* HOW TO ORDER ON WHATSAPP & EASYPAISA STEP-BY-STEP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#15231F] border border-[#233730] rounded-3xl p-6 sm:p-10 relative overflow-hidden">
          <div className="max-w-3xl space-y-6">
            <span className="text-xs font-bold text-[#B7F34A] uppercase tracking-wider block">
              Transparent & Verified Ordering
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              How Ordering Works on Digital Product Pakistan
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              We make ordering fast, transparent, and completely verifiable with zero foreign transaction fees:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
              <div className="space-y-2">
                <div className="w-9 h-9 rounded-xl bg-[#25D366] text-white flex items-center justify-center font-extrabold text-sm">
                  1
                </div>
                <h4 className="font-bold text-white text-sm">Order on WhatsApp</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Click "Order on WhatsApp Direct" on any software or tool. You will connect directly with Muhammad Kumail Ali.
                </p>
              </div>

              <div className="space-y-2">
                <div className="w-9 h-9 rounded-xl bg-[#B7F34A] text-[#111C18] flex items-center justify-center font-extrabold text-sm">
                  2
                </div>
                <h4 className="font-bold text-white text-sm">Pay via Easypaisa</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Send the listed PKR price to Easypaisa Account: <strong>03010333544</strong> (MUHAMMAD KUMAIL ALI) and share the screenshot.
                </p>
              </div>

              <div className="space-y-2">
                <div className="w-9 h-9 rounded-xl bg-[#1A2924] border border-[#233730] text-[#B7F34A] flex items-center justify-center font-extrabold text-sm">
                  3
                </div>
                <h4 className="font-bold text-white text-sm">Instant Delivery</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Our team verifies the TRX ID and delivers your login credentials or software license download link directly to your WhatsApp.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 30+ SEO ARTICLES & GUIDES PREVIEW SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#233730] pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#B7F34A] uppercase tracking-wider mb-1">
              <Newspaper className="w-4 h-4" />
              <span>32 In-Depth Guides & Tutorials</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Learn Digital Tools, Marketing & AI in Pakistan
            </h2>
          </div>

          <button
            onClick={() => onNavigate('blog-index')}
            className="bg-[#1A2924] hover:bg-[#233730] text-[#B7F34A] border border-[#233730] font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
          >
            <span>View All 32 Articles</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.slice(0, 6).map((post) => (
            <article
              key={post.id}
              onClick={() => onSelectBlog(post)}
              className="bg-[#15231F] border border-[#233730] hover:border-[#B7F34A]/50 rounded-2xl overflow-hidden cursor-pointer transition-all flex flex-col group"
            >
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#B7F34A] bg-[#1A2924] px-2 py-0.5 rounded-md">
                    {post.category}
                  </span>
                  <h3 className="font-bold text-white text-sm group-hover:text-[#B7F34A] transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#233730] flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{post.publishedAt}</span>
                  </span>
                  <span className="text-[#B7F34A] font-semibold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                    Read Guide <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};
