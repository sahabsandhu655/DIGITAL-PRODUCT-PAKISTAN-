import React, { useState, useMemo } from 'react';
import { Search, Cpu, ShieldAlert, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';

interface SoftwarePageProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export const SoftwarePage: React.FC<SoftwarePageProps> = ({ products, onSelectProduct }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'published' | 'drafts'>('all');

  const softwareProducts = useMemo(() => {
    return products.filter(p => p.productType === 'software');
  }, [products]);

  const filtered = useMemo(() => {
    return softwareProducts.filter(p => {
      const matchSearch = searchQuery.trim() === '' ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchFilter = 
        filterType === 'all' ? true :
        filterType === 'published' ? p.status === 'published' :
        p.status === 'draft';

      return matchSearch && matchFilter;
    });
  }, [softwareProducts, searchQuery, filterType]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="border-b border-[#233730] pb-8">
        <div className="flex items-center gap-2 text-xs font-bold text-[#B7F34A] uppercase tracking-wider mb-2">
          <Cpu className="w-4 h-4" />
          <span>Productivity & AI Tools</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          Software & Digital Tools
        </h1>
        <p className="mt-2 text-sm text-slate-300 max-w-3xl leading-relaxed">
          Access verified digital subscriptions, team panels, creative design suites, and AI automation software. All software offers are subject to rigorous license verification and manual Easypaisa order verification.
        </p>

        {/* Legal Transparency Notice */}
        <div className="mt-6 bg-[#162420] border border-[#233730] rounded-2xl p-4 flex items-start gap-3 text-xs text-slate-300">
          <Info className="w-5 h-5 text-[#B7F34A] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-white block">Licensing & Verification Policy</span>
            <p className="text-slate-400 leading-relaxed">
              Digital Product Pakistan does not sell cracked, pirated, or unauthorized accounts. All software titles, team seats, vouchers, and license terms are verified by our team. Unverified draft offers remain clearly flagged and editable by the store administrator.
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-[#15231F] border border-[#233730] rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search software tools (e.g. CapCut, Canva, Gemini, ElevenLabs)..."
            className="w-full bg-[#1A2924] border border-[#233730] focus:border-[#B7F34A] rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-slate-400 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer ${
              filterType === 'all'
                ? 'bg-[#B7F34A] text-[#111C18]'
                : 'bg-[#1A2924] text-slate-300 hover:text-white'
            }`}
          >
            All Tools ({softwareProducts.length})
          </button>
          <button
            onClick={() => setFilterType('published')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer ${
              filterType === 'published'
                ? 'bg-[#B7F34A] text-[#111C18]'
                : 'bg-[#1A2924] text-slate-300 hover:text-white'
            }`}
          >
            Available Now
          </button>
          <button
            onClick={() => setFilterType('drafts')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer ${
              filterType === 'drafts'
                ? 'bg-[#B7F34A] text-[#111C18]'
                : 'bg-[#1A2924] text-slate-300 hover:text-white'
            }`}
          >
            Pending Verification Drafts
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filtered.map((prod) => (
          <ProductCard key={prod.id} product={prod} onSelect={onSelectProduct} />
        ))}
      </div>
    </div>
  );
};
