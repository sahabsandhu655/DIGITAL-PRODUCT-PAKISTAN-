import React, { useState } from 'react';
import { 
  ArrowRight, 
  Search, 
  Cpu, 
  ShieldCheck, 
  Clock, 
  CheckCircle, 
  Sparkles,
  MessageCircle,
  HelpCircle,
  Phone,
  Layers
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

  return (
    <div className="space-y-16 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#111C18] via-[#15231F] to-[#111C18] pt-14 pb-20 border-b border-[#233730]">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#B7F34A_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Trust Badge */}
          <div className="inline-flex items-center gap-2 bg-[#1A2924] border border-[#25D366]/40 px-4 py-1.5 rounded-full text-xs font-semibold text-[#25D366] mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
            <span>Official Digital Subscriptions & Tools • Direct WhatsApp Orders: {whatsappDisplay}</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
            Premium Software & Tools. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B7F34A] via-[#DFF5D5] to-[#B7F34A]">
              Delivered Direct to WhatsApp.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-5 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Get instant activation for ChatGPT Pro, Gemini Pro, WhatsApp Bulk SMS Sender, CapCut Pro, ElevenLabs, and Canva Panel in PKR with manual Easypaisa verification.
          </p>

          {/* Quick Contact & WhatsApp Order Strip */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="bg-[#25D366] hover:bg-[#20ba59] text-white font-extrabold text-xs sm:text-sm px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg shadow-[#25D366]/20 active:scale-95 transition-all"
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
          <div className="mt-9 max-w-xl mx-auto">
            <div className="relative flex items-center">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
              <input
                type="text"
                value={heroSearch}
                onChange={(e) => setHeroSearch(e.target.value)}
                placeholder="Search ChatGPT, CapCut, WhatsApp Sender, Canva..."
                className="w-full bg-[#162420] border-2 border-[#233730] focus:border-[#B7F34A] text-white placeholder-slate-400 text-sm rounded-2xl py-3.5 pl-12 pr-4 focus:outline-none transition-all shadow-xl shadow-black/40"
              />
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
                    ChatGPT Pro, Gemini Pro, CapCut Pro individual & team, ElevenLabs, and Microsoft 365
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
                    WhatsApp Bulk SMS Sender (18 illustrated features) and Canva Admin Reseller Panel
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

      {/* HOW TO ORDER ON WHATSAPP & EASYPAISA STEP-BY-STEP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#15231F] border border-[#233730] rounded-3xl p-8 sm:p-12 relative overflow-hidden">
          <div className="max-w-3xl space-y-6">
            <span className="text-xs font-bold text-[#B7F34A] uppercase tracking-wider block">
              Transparent & Verified Ordering
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              How Ordering Works on Digital Product Pakistan
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              We make ordering fast, transparent, and completely verifiable with zero foreign transaction fees:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
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
    </div>
  );
};
