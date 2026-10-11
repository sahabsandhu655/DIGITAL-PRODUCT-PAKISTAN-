import React, { useState } from 'react';
import { 
  ArrowRight, 
  Search, 
  BookOpen, 
  Cpu, 
  GraduationCap, 
  ShieldCheck, 
  Clock, 
  CheckCircle, 
  Sparkles,
  MessageCircle,
  HelpCircle,
  ExternalLink
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

  const publishedProducts = products.filter(p => p.status === 'published');
  
  // Categorized products
  const popularEbooks = publishedProducts
    .filter(p => p.productType === 'ebook')
    .slice(0, 4);

  const featuredSoftware = products
    .filter(p => p.productType === 'software')
    .slice(0, 4);

  const courseCollections = publishedProducts
    .filter(p => p.productType === 'course')
    .slice(0, 3);

  const recentProducts = publishedProducts
    .slice(0, 4);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      onNavigate(`ebooks?q=${encodeURIComponent(heroSearch.trim())}`);
    }
  };

  return (
    <div className="space-y-20 pb-20">
      {/* 1. HERO SECTION (Dark charcoal with electric lime highlights) */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#111C18] via-[#15231F] to-[#111C18] pt-16 pb-24 border-b border-[#233730]">
        {/* Subtle grid pattern backdrop */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#B7F34A_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Trust Badge Pill */}
          <div className="inline-flex items-center gap-2 bg-[#1A2924] border border-[#233730] px-4 py-1.5 rounded-full text-xs font-semibold text-[#B7F34A] mb-8 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#B7F34A] animate-pulse"></span>
            <span>Pakistan's Digital Marketplace • Manual Verification & Direct Delivery</span>
          </div>

          {/* Primary Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
            Your Digital World. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B7F34A] via-[#DFF5D5] to-[#B7F34A]">
              One Place.
            </span>
          </h1>

          {/* Supporting Headline */}
          <p className="mt-6 text-base sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Discover e-books, powerful digital tools, and online courses to learn, create, and grow.
          </p>

          {/* Search bar */}
          <div className="mt-10 max-w-2xl mx-auto">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
              <input
                type="text"
                value={heroSearch}
                onChange={(e) => setHeroSearch(e.target.value)}
                placeholder="Search e-books, tools, and courses..."
                className="w-full bg-[#162420] border-2 border-[#233730] focus:border-[#B7F34A] text-white placeholder-slate-400 text-sm sm:text-base rounded-2xl py-4 pl-12 pr-32 focus:outline-none transition-all shadow-xl shadow-black/40"
              />
              <button
                type="submit"
                className="absolute right-2.5 bg-[#B7F34A] hover:bg-[#A3E037] text-[#111C18] font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl transition-all cursor-pointer shadow-md shadow-[#B7F34A]/20 active:scale-95"
              >
                Search
              </button>
            </form>
          </div>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => onNavigate('ebooks')}
              className="bg-[#B7F34A] hover:bg-[#A3E037] text-[#111C18] font-extrabold text-sm sm:text-base px-8 py-3.5 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-[#B7F34A]/20 cursor-pointer active:scale-95"
            >
              <span>Explore Products</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('courses')}
              className="bg-[#1A2924] hover:bg-[#233730] text-white border border-[#233730] font-bold text-sm sm:text-base px-8 py-3.5 rounded-xl flex items-center gap-2 transition-all cursor-pointer"
            >
              <GraduationCap className="w-4 h-4 text-[#B7F34A]" />
              <span>Browse Courses</span>
            </button>
          </div>

          {/* Key Value Pillars */}
          <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8 border-t border-[#233730]/60">
            <div className="flex items-center gap-2 text-left text-xs sm:text-sm text-slate-300">
              <ShieldCheck className="w-5 h-5 text-[#B7F34A] shrink-0" />
              <span>Easypaisa Manual Check</span>
            </div>
            <div className="flex items-center gap-2 text-left text-xs sm:text-sm text-slate-300">
              <Clock className="w-5 h-5 text-[#B7F34A] shrink-0" />
              <span>Direct WhatsApp Delivery</span>
            </div>
            <div className="flex items-center gap-2 text-left text-xs sm:text-sm text-slate-300">
              <Sparkles className="w-5 h-5 text-[#B7F34A] shrink-0" />
              <span>Fair PKR Pricing</span>
            </div>
            <div className="flex items-center gap-2 text-left text-xs sm:text-sm text-slate-300">
              <CheckCircle className="w-5 h-5 text-[#B7F34A] shrink-0" />
              <span>100% Guest Checkout</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURED CATEGORIES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-[#B7F34A] text-xs font-bold uppercase tracking-widest block mb-2">
            Categories
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Explore by Department
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* E-books Card */}
          <div 
            onClick={() => onNavigate('ebooks')}
            className="group bg-[#15231F] border border-[#233730] hover:border-[#B7F34A] rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-[#B7F34A]/5 cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#1A2924] text-[#B7F34A] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-[#B7F34A] transition-colors">
                E-books & Guides
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Business, Novels, Entrepreneurship, Dating, and Romantic literature with downloadable PDFs.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-1.5 text-xs font-bold text-[#B7F34A]">
              <span>Explore E-books</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Software & Tools Card */}
          <div 
            onClick={() => onNavigate('software')}
            className="group bg-[#15231F] border border-[#233730] hover:border-[#B7F34A] rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-[#B7F34A]/5 cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#1A2924] text-[#B7F34A] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-[#B7F34A] transition-colors">
                Software & AI Tools
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Video editors, AI voice synthesis, Canva suites, and verified productivity licenses.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-1.5 text-xs font-bold text-[#B7F34A]">
              <span>View Tools</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Courses Card */}
          <div 
            onClick={() => onNavigate('courses')}
            className="group bg-[#15231F] border border-[#233730] hover:border-[#B7F34A] rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-[#B7F34A]/5 cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#1A2924] text-[#B7F34A] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-[#B7F34A] transition-colors">
                Online Courses & Bundles
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                500+ English masterclasses and 2,000+ Hindi & Urdu video tutorials for high-income skills.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-1.5 text-xs font-bold text-[#B7F34A]">
              <span>Browse Vault</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* 3. POPULAR E-BOOKS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-[#B7F34A] text-xs font-bold uppercase tracking-widest block mb-1">
              Curated Reading
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Featured E-books
            </h2>
          </div>
          <button
            onClick={() => onNavigate('ebooks')}
            className="text-xs font-bold text-[#B7F34A] hover:underline flex items-center gap-1 cursor-pointer self-start sm:self-auto"
          >
            <span>View All E-books</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularEbooks.map((prod) => (
            <ProductCard key={prod.id} product={prod} onSelect={onSelectProduct} />
          ))}
        </div>
      </section>

      {/* 4. FEATURED SOFTWARE & AI TOOLS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-[#B7F34A] text-xs font-bold uppercase tracking-widest block mb-1">
              Productivity & AI
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Software & Digital Tools
            </h2>
          </div>
          <button
            onClick={() => onNavigate('software')}
            className="text-xs font-bold text-[#B7F34A] hover:underline flex items-center gap-1 cursor-pointer self-start sm:self-auto"
          >
            <span>View All Tools</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredSoftware.map((prod) => (
            <ProductCard key={prod.id} product={prod} onSelect={onSelectProduct} />
          ))}
        </div>
      </section>

      {/* 5. COURSE COLLECTIONS (500+ English & 2,000+ Hindi/Urdu) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#15231F] border border-[#233730] rounded-3xl p-8 sm:p-12 relative overflow-hidden">
          <div className="max-w-3xl relative z-10 space-y-6">
            <span className="inline-block bg-[#1A2924] text-[#B7F34A] text-xs font-bold px-3 py-1 rounded-lg border border-[#233730]">
              Skill Acceleration Hub
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
              Master In-Demand Skills with English & Urdu Video Vaults
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Whether you prefer comprehensive English technical curricula or conversational step-by-step Hindi & Urdu video masterclasses, our structured collections provide practical, project-based learning.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={() => onNavigate('courses')}
                className="bg-[#B7F34A] text-[#111C18] hover:bg-[#A3E037] font-bold text-sm px-6 py-3 rounded-xl flex items-center gap-2 cursor-pointer transition-all active:scale-95"
              >
                <span>Browse 500+ English Courses</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onNavigate('courses')}
                className="bg-[#1A2924] text-white hover:bg-[#233730] border border-[#233730] font-bold text-sm px-6 py-3 rounded-xl flex items-center gap-2 cursor-pointer transition-all"
              >
                <span>Explore 2,000+ Urdu Vault</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. LATEST BLOG ARTICLES */}
      {blogPosts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-[#B7F34A] text-xs font-bold uppercase tracking-widest block mb-1">
                Articles & Tutorials
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Latest Product Guides
              </h2>
            </div>
            <button
              onClick={() => onNavigate('blog')}
              className="text-xs font-bold text-[#B7F34A] hover:underline flex items-center gap-1 cursor-pointer self-start sm:self-auto"
            >
              <span>Read All Articles</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogPosts.slice(0, 3).map((post) => (
              <div
                key={post.id}
                onClick={() => onSelectBlog(post)}
                className="group bg-[#15231F] border border-[#233730] hover:border-[#B7F34A]/50 rounded-2xl overflow-hidden cursor-pointer flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-[#B7F34A]/5"
              >
                <div className="h-44 overflow-hidden bg-black">
                  <img
                    src={post.coverImage}
                    alt={post.imageAlt || post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-xs text-[#B7F34A] font-semibold">{post.category}</span>
                    <h3 className="font-bold text-base text-white group-hover:text-[#B7F34A] transition-colors mt-1 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-xs text-slate-300 line-clamp-2 mt-2 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-[#233730] flex items-center justify-between text-xs text-slate-400">
                    <span>By {post.author}</span>
                    <span className="text-[#B7F34A] font-semibold flex items-center gap-1">
                      Read <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 7. WHY CHOOSE US (Realistic, unexaggerated, trustworthy) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#111C18] border border-[#233730] rounded-3xl p-8 sm:p-12">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-[#B7F34A] text-xs font-bold uppercase tracking-widest block mb-2">
              Customer First Guarantee
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Why Customers Choose Digital Product Pakistan
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3 p-4 rounded-xl bg-[#15231F] border border-[#233730]">
              <div className="w-10 h-10 rounded-lg bg-[#1A2924] text-[#B7F34A] flex items-center justify-center font-bold">
                1
              </div>
              <h3 className="font-bold text-white text-base">Direct Human Verification</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                We inspect every Easypaisa transaction ID and proof screenshot manually before delivering products, eliminating gateway errors and payment deduction bugs.
              </p>
            </div>

            <div className="space-y-3 p-4 rounded-xl bg-[#15231F] border border-[#233730]">
              <div className="w-10 h-10 rounded-lg bg-[#1A2924] text-[#B7F34A] flex items-center justify-center font-bold">
                2
              </div>
              <h3 className="font-bold text-white text-base">WhatsApp Delivery & Support</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Get your digital files, invite links, and setup credentials sent directly to your WhatsApp. Our human support agent is always a message away if you need setup help.
              </p>
            </div>

            <div className="space-y-3 p-4 rounded-xl bg-[#15231F] border border-[#233730]">
              <div className="w-10 h-10 rounded-lg bg-[#1A2924] text-[#B7F34A] flex items-center justify-center font-bold">
                3
              </div>
              <h3 className="font-bold text-white text-base">Honest PKR Pricing</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                All prices are displayed in Pakistani Rupees (PKR) with no surprise taxes or international exchange bank fees. Pay exactly what you see.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. SUPPORT & WHATSAPP HANDOFF CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#1A2924] to-[#15231F] border border-[#233730] rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-extrabold text-white">
              Have Questions Before Placing an Order?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Our team is available on WhatsApp to answer questions regarding licensing, course formats, or payment verification.
            </p>
          </div>
          <a
            href="https://wa.me/923001234567"
            target="_blank"
            rel="noreferrer"
            className="bg-[#B7F34A] hover:bg-[#A3E037] text-[#111C18] font-bold text-sm px-6 py-3.5 rounded-xl flex items-center gap-2 shrink-0 transition-all shadow-lg shadow-[#B7F34A]/20"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>
      </section>
    </div>
  );
};
