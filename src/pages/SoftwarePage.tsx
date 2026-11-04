import React, { useState, useMemo } from 'react';
import { Search, Cpu, MessageCircle, ShieldCheck } from 'lucide-react';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';

interface SoftwarePageProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export const SoftwarePage: React.FC<SoftwarePageProps> = ({ products, onSelectProduct }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const softwareProducts = useMemo(() => {
    return products.filter(p => p.productType === 'software' || p.productType === 'course');
  }, [products]);

  const filtered = useMemo(() => {
    return softwareProducts.filter(p => {
      return (
        searchQuery.trim() === '' ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [softwareProducts, searchQuery]);

  const whatsappDisplay = '+92 310 7759274';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="border-b border-[#233730] pb-8">
        <div className="flex items-center gap-2 text-xs font-bold text-[#B7F34A] uppercase tracking-wider mb-2">
          <Cpu className="w-4 h-4" />
          <span>Productivity & AI Subscriptions</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          Software Subscriptions
        </h1>
        <p className="mt-2 text-sm text-slate-300 max-w-3xl leading-relaxed">
          Official accounts and subscription licenses for ChatGPT Pro, Google Gemini Pro, Notion Plus, Microsoft 365, CapCut Pro individual & team, ElevenLabs, HMA VPN, Outlook Mail, and Super Duolingo. Pay in PKR via Easypaisa or order directly on WhatsApp.
        </p>

        {/* WhatsApp Direct Order Highlight */}
        <div className="mt-6 bg-[#173024] border border-[#25D366]/40 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <MessageCircle className="w-6 h-6 text-[#25D366] shrink-0" />
            <div>
              <span className="font-bold text-white text-sm block">Direct WhatsApp Order Available</span>
              <p className="text-xs text-slate-300">
                Contact Founder Muhammad Kumail Ali on WhatsApp at <strong className="text-white">{whatsappDisplay}</strong> for instant credentials delivery.
              </p>
            </div>
          </div>
          <a
            href="https://wa.me/923107759274?text=Salam!%20I%20want%20to%20order%20software%20from%20Digital%20Product%20Pakistan."
            target="_blank"
            rel="noreferrer"
            className="shrink-0 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md transition-all active:scale-95"
          >
            Chat on WhatsApp
          </a>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-[#15231F] border border-[#233730] rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search software (ChatGPT Pro, Gemini Pro, CapCut, Microsoft 365)..."
            className="w-full bg-[#1A2924] border border-[#233730] focus:border-[#B7F34A] rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-slate-400 focus:outline-none"
          />
        </div>
        <span className="text-xs text-slate-400 font-semibold shrink-0">
          {filtered.length} Software Available
        </span>
      </div>

      {/* Software Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onSelect={onSelectProduct}
          />
        ))}
      </div>
    </div>
  );
};
