import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Newspaper, 
  ArrowRight, 
  Calendar, 
  User, 
  Tag, 
  Sparkles, 
  ShieldCheck, 
  MessageCircle, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  Send, 
  Zap, 
  HelpCircle,
  FileSpreadsheet,
  Users,
  Lock,
  Flame,
  Clock
} from 'lucide-react';
import { BlogPost } from '../types';

interface BlogIndexPageProps {
  posts: BlogPost[];
  onSelectBlog: (post: BlogPost) => void;
  onNavigate?: (route: string) => void;
}

interface TrustFaq {
  q: string;
  a: string;
}

const TRUST_FAQS: TrustFaq[] = [
  {
    q: "Why should I buy digital subscriptions from DPP instead of directly with my debit/credit card?",
    a: "Most Pakistani commercial bank cards (Meezan, HBL, Allied, Standard Chartered, Sadapay, Nayapay) either decline foreign SaaS transactions outright due to State Bank restrictions or slap an extra 10% to 14% withholding tax and unfavorable currency exchange markups. Digital Product Pakistan lets you pay the exact PKR price using local Easypaisa with zero additional fees."
  },
  {
    q: "How does the WhatsApp Bulk SMS Sender protect my WhatsApp numbers from getting banned?",
    a: "Our software uses intelligent human-speed randomized delays (e.g. 5 to 15 seconds pause between messages), multi-account number rotation, and dynamic personalization tags like {name}. This mimics natural human typing patterns rather than automated bot blasts, keeping your sending numbers safe."
  },
  {
    q: "Are the software accounts and licenses shared or 100% private?",
    a: "We only provide 100% genuine private accounts and official license keys. Your login credentials, files, chat history, and cloud storage (such as Microsoft 365 1TB OneDrive and Notion Plus workspace) remain completely private and under your control."
  },
  {
    q: "How fast is delivery after sending payment via Easypaisa?",
    a: "Delivery is fulfilled manually within 15 to 30 minutes! Once you transfer payment to Easypaisa Account 03010333544 (MUHAMMAD KUMAIL ALI) and share the screenshot on WhatsApp +92 310 7759274, our team verifies the TRX ID and delivers your access details directly to your phone."
  },
  {
    q: "What happens if a subscription has an issue before its validity ends?",
    a: "Every product comes with a full-validity replacement guarantee. If you encounter any login or session issue, simply message Muhammad Kumail Ali on WhatsApp (+92 310 7759274) for immediate technical support or a fresh replacement account."
  }
];

export const BlogIndexPage: React.FC<BlogIndexPageProps> = ({ 
  posts, 
  onSelectBlog,
  onNavigate 
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // WhatsApp Deep-Dive Articles (10 articles dedicated to WhatsApp Bulk SMS Sender)
  const whatsAppArticles = useMemo(() => {
    return posts.filter(p => 
      p.id.startsWith('art-wa-') || 
      p.title.toLowerCase().includes('whatsapp') ||
      (p.tags && p.tags.some(t => t.toLowerCase().includes('whatsapp bulk')))
    );
  }, [posts]);

  // Dynamic Categories derived from post collection
  const categories = useMemo(() => {
    const cats = ['All', 'WhatsApp Bulk SMS Sender', 'AI Subscriptions', 'Productivity & Cloud', 'Design & Video Editing', 'Security & VPN', 'Payment & Trust'];
    return cats;
  }, []);

  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      let matchCategory = true;
      if (selectedCategory === 'WhatsApp Bulk SMS Sender') {
        matchCategory = post.id.startsWith('art-wa-') || 
          post.title.toLowerCase().includes('whatsapp') ||
          post.category === 'Marketing Tools';
      } else if (selectedCategory === 'AI Subscriptions') {
        matchCategory = post.category === 'AI Tools' || post.title.toLowerCase().includes('chatgpt') || post.title.toLowerCase().includes('gemini');
      } else if (selectedCategory === 'Productivity & Cloud') {
        matchCategory = post.category === 'Digital Productivity' || post.title.toLowerCase().includes('notion') || post.title.toLowerCase().includes('microsoft');
      } else if (selectedCategory === 'Design & Video Editing') {
        matchCategory = post.category === 'Design & Creativity' || post.title.toLowerCase().includes('capcut') || post.title.toLowerCase().includes('canva');
      } else if (selectedCategory === 'Security & VPN') {
        matchCategory = post.category === 'Security & Privacy' || post.title.toLowerCase().includes('vpn') || post.title.toLowerCase().includes('outlook');
      } else if (selectedCategory === 'Payment & Trust') {
        matchCategory = post.category === 'Payment & Trust' || post.title.toLowerCase().includes('easypaisa') || post.title.toLowerCase().includes('freelancer');
      }

      const matchSearch = searchQuery.trim() === '' ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (post.tags && post.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));

      return matchCategory && matchSearch;
    });
  }, [posts, selectedCategory, searchQuery]);

  const toggleFaq = (idx: number) => {
    setOpenFaqIndex(openFaqIndex === idx ? null : idx);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-16">
      {/* 1. SECTION HEADER */}
      <div className="border-b border-[#233730] pb-8 space-y-3">
        <div className="inline-flex items-center gap-2 text-xs font-bold text-[#B7F34A] uppercase tracking-wider bg-[#1A2924] border border-[#233730] px-3 py-1 rounded-full">
          <Newspaper className="w-3.5 h-3.5" />
          <span>Knowledge Base • {posts.length} In-Depth Articles & Tutorials</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Digital Tools & Software Subscriptions Hub
        </h1>

        <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
          Master the highest-ROI software tools in Pakistan. Explore detailed feature breakdowns, anti-ban marketing strategies, AI productivity workflows, and verified Easypaisa purchasing guides.
        </p>
      </div>

      {/* 2. SPECIAL 10 DEEP-DIVE GUIDES: WHATSAPP BULK SMS SENDER SPOTLIGHT */}
      <section className="bg-gradient-to-br from-[#15231F] via-[#1A2E28] to-[#111C18] border-2 border-[#25D366]/40 rounded-3xl p-6 sm:p-10 space-y-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#25D366]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-[#233730] pb-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-[#25D366]/10 border border-[#25D366]/30 px-3 py-1 rounded-full text-xs font-bold text-[#25D366]">
              <Send className="w-3.5 h-3.5" />
              <span>Flagship Mastery • 10 Dedicated Feature Deep-Dives</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              WhatsApp Bulk SMS Sender Mastery Guides
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Everything you need to know about scaling direct WhatsApp marketing across Pakistan without getting banned, with zero per-message cost.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href="https://wa.me/923107759274?text=Salam%20Muhammad%20Kumail%20Ali!%20I%20want%20to%20order%20WhatsApp%20Bulk%20SMS%20Sender%20for%20Rs.%202,499%20PKR."
              target="_blank"
              rel="noreferrer"
              className="bg-[#25D366] hover:bg-[#20ba59] text-white font-black text-xs sm:text-sm px-5 py-3 rounded-xl flex items-center gap-2 shadow-lg shadow-[#25D366]/20 transition-all cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Order Software (Rs. 2,499 PKR)</span>
            </a>
          </div>
        </div>

        {/* The 10 WhatsApp Deep-Dive Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 relative z-10">
          {whatsAppArticles.slice(0, 10).map((article, idx) => (
            <div
              key={article.id}
              onClick={() => onSelectBlog(article)}
              className="bg-[#111C18]/90 border border-[#233730] hover:border-[#25D366]/60 rounded-2xl p-5 flex flex-col justify-between space-y-4 cursor-pointer transition-all hover:scale-[1.01] hover:shadow-xl group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#25D366] bg-[#25D366]/10 px-2.5 py-1 rounded-md border border-[#25D366]/20">
                    Guide #{String(idx + 1).padStart(2, '0')}
                  </span>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span>5 min read</span>
                  </span>
                </div>

                <h3 className="font-bold text-white text-sm group-hover:text-[#25D366] transition-colors line-clamp-2 leading-snug">
                  {article.title}
                </h3>

                <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                  {article.excerpt}
                </p>
              </div>

              <div className="pt-3 border-t border-[#233730] flex items-center justify-between text-xs text-[#25D366] font-semibold">
                <span>Read Full Deep-Dive</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. DYNAMIC SEARCH & CATEGORY FILTER BAR */}
      <section className="bg-[#15231F] border border-[#233730] rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              Explore All Digital Tool Articles ({posts.length})
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Select a category or type any tool name to dynamically filter all tutorials.
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by tool, feature, or keyword..."
              className="w-full bg-[#1A2924] border border-[#233730] focus:border-[#B7F34A] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#B7F34A] text-[#111C18] font-bold shadow-md shadow-[#B7F34A]/10'
                    : 'bg-[#1A2924] text-slate-300 hover:text-white hover:bg-[#233730]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </section>

      {/* 4. MAIN ARTICLES GRID */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400 font-semibold">
            Showing <strong className="text-white">{filteredPosts.length}</strong> of {posts.length} articles
          </span>
          {(selectedCategory !== 'All' || searchQuery) && (
            <button
              onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
              className="text-xs text-[#B7F34A] hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>

        {filteredPosts.length === 0 ? (
          <div className="bg-[#15231F] border border-[#233730] rounded-3xl p-12 text-center space-y-3">
            <HelpCircle className="w-8 h-8 text-slate-500 mx-auto" />
            <h3 className="font-bold text-white text-base">No articles found matching "{searchQuery}"</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Try searching for "ChatGPT", "WhatsApp", "Notion", "Microsoft 365", "Easypaisa", or "CapCut".
            </p>
            <button
              onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
              className="bg-[#1A2924] hover:bg-[#233730] text-[#B7F34A] border border-[#233730] text-xs font-bold px-4 py-2 rounded-xl cursor-pointer"
            >
              View All Articles
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                onClick={() => onSelectBlog(post)}
                className="group bg-[#15231F] border border-[#233730] hover:border-[#B7F34A]/60 rounded-3xl overflow-hidden cursor-pointer flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-[#B7F34A]/5 hover:-translate-y-1"
              >
                <div className="h-44 sm:h-48 overflow-hidden bg-[#111C18] flex items-center justify-center p-4 relative border-b border-[#233730]">
                  <img
                    src={post.coverImage}
                    alt={post.imageAlt || post.title}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 bg-[#111C18]/90 border border-[#233730] text-[#B7F34A] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full backdrop-blur-sm">
                    {post.category}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <span className="text-[11px] text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-PK', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </span>

                    <h2 className="font-bold text-base text-white group-hover:text-[#B7F34A] transition-colors leading-snug line-clamp-2">
                      {post.title}
                    </h2>

                    <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#233730] flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1.5 truncate max-w-[140px]">
                      <User className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span className="truncate">{post.author}</span>
                    </span>
                    <span className="text-[#B7F34A] font-bold flex items-center gap-1 shrink-0">
                      Read Guide <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* 5. INTERACTIVE "WHY CHOOSE DIGITAL PRODUCT PAKISTAN" TRUST & VERIFICATION SECTION */}
      <section className="bg-[#15231F] border border-[#233730] rounded-3xl p-6 sm:p-12 space-y-10 relative overflow-hidden">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 bg-[#B7F34A]/10 border border-[#B7F34A]/30 px-3 py-1 rounded-full text-xs font-bold text-[#B7F34A]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Buyer Assurance & Security</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
            Why Choose Digital Product Pakistan?
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            We solve the #1 issue Pakistani creators, freelancers, and businesses face: getting blocked by international payment gateways and losing money to unverified sellers.
          </p>
        </div>

        {/* 4 Trust Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#111C18] border border-[#233730] rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#B7F34A]/10 text-[#B7F34A] flex items-center justify-center font-black text-sm">
              01
            </div>
            <h3 className="text-base font-bold text-white">
              Zero International Bank Card Tax & SBP Restrictions
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Skip credit card declines and 10%–14% withholding taxes imposed on foreign tech purchases. Pay in exact Pakistani Rupees (PKR) directly to Easypaisa Account <strong>03010333544</strong> (MUHAMMAD KUMAIL ALI).
            </p>
          </div>

          <div className="bg-[#111C18] border border-[#233730] rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#25D366]/10 text-[#25D366] flex items-center justify-center font-black text-sm">
              02
            </div>
            <h3 className="text-base font-bold text-white">
              100% Genuine Private Logins & Authentic Keys
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              No shared community pools or risky cookies that log you out every 2 hours. Your Notion Plus workspaces, Microsoft 365 1TB OneDrive, and ChatGPT Pro accounts are dedicated exclusively to you.
            </p>
          </div>

          <div className="bg-[#111C18] border border-[#233730] rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-black text-sm">
              03
            </div>
            <h3 className="text-base font-bold text-white">
              15–30 Minute Direct WhatsApp Delivery
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Orders are fulfilled directly by founder Muhammad Kumail Ali. As soon as your Easypaisa TRX ID is received on WhatsApp (<strong>+92 310 7759274</strong>), your software setups and logins are delivered instantly.
            </p>
          </div>

          <div className="bg-[#111C18] border border-[#233730] rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-black text-sm">
              04
            </div>
            <h3 className="text-base font-bold text-white">
              Full Validity Replacement Guarantee
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Every digital license comes with complete peace of mind. If any account ever encounters an unexpected session reset during its duration, our WhatsApp support team provides an immediate replacement or fix.
            </p>
          </div>
        </div>

        {/* Interactive Trust FAQs */}
        <div className="border-t border-[#233730] pt-8 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <HelpCircle className="w-4 h-4 text-[#B7F34A]" />
            <h3 className="text-lg font-bold text-white">Frequently Asked Questions & Answers</h3>
          </div>

          <div className="space-y-3">
            {TRUST_FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div 
                  key={idx}
                  className="bg-[#111C18] border border-[#233730] rounded-2xl overflow-hidden transition-all"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-[#1A2924]/40"
                  >
                    <span className="font-bold text-white text-xs sm:text-sm">
                      {faq.q}
                    </span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-[#B7F34A] shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-5 text-xs text-slate-300 leading-relaxed border-t border-[#233730]/60 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Direct WhatsApp Callout Banner */}
        <div className="bg-[#111C18] border border-[#25D366]/30 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-xs font-bold text-[#25D366] block">Have custom software inquiries or enterprise orders?</span>
            <p className="text-xs text-slate-400">Chat directly with Muhammad Kumail Ali on official WhatsApp: <strong>+92 310 7759274</strong></p>
          </div>

          <a
            href="https://wa.me/923107759274?text=Salam%20Muhammad%20Kumail%20Ali!%20I%20have%20a%20question%20about%20your%20digital%20products."
            target="_blank"
            rel="noreferrer"
            className="bg-[#25D366] hover:bg-[#20ba59] text-white font-extrabold text-xs px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-md shadow-[#25D366]/20 transition-all cursor-pointer shrink-0"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>
      </section>
    </div>
  );
};
