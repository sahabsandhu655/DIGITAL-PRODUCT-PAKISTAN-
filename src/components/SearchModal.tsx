import React, { useState } from 'react';
import { Search, X, ArrowRight, BookOpen, Cpu, GraduationCap } from 'lucide-react';
import { Product } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ 
  isOpen, 
  onClose, 
  products, 
  onSelectProduct 
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const filtered = query.trim() === '' 
    ? products.slice(0, 6) 
    : products.filter(p => 
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase()) ||
        (p.shortDescription && p.shortDescription.toLowerCase().includes(query.toLowerCase())) ||
        p.tags.some(t => t.toLowerCase().includes(query.toLowerCase()))
      );

  const getIcon = (type: string) => {
    switch (type) {
      case 'ebook': return <BookOpen className="w-4 h-4 text-[#B7F34A]" />;
      case 'software': return <Cpu className="w-4 h-4 text-[#B7F34A]" />;
      case 'course': return <GraduationCap className="w-4 h-4 text-[#B7F34A]" />;
      default: return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-20 flex justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />

      <div className="relative bg-[#15231F] border border-[#233730] rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden self-start">
        {/* Input box */}
        <div className="p-4 border-b border-[#233730] flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search e-books, tools, and courses..."
            className="flex-1 bg-transparent text-white placeholder-slate-400 focus:outline-none text-base"
            autoFocus
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-white p-1 text-xs cursor-pointer"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#1A2924] cursor-pointer"
            aria-label="Close search"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-2">
          <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            {query.trim() === '' ? 'Suggested Products' : `Results (${filtered.length})`}
          </div>

          {filtered.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm">
              No matching products found. Try keywords like "freelance", "courses", or "Canva".
            </div>
          ) : (
            filtered.map((prod) => (
              <div
                key={prod.id}
                onClick={() => {
                  onSelectProduct(prod);
                  onClose();
                }}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#1A2924] border border-transparent hover:border-[#233730] transition-colors cursor-pointer group"
              >
                <img
                  src={prod.images[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=80&auto=format&fit=crop&q=80'}
                  alt={prod.title}
                  className="w-12 h-12 rounded-lg object-cover bg-black shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {getIcon(prod.productType)}
                    <h4 className="font-semibold text-sm text-white group-hover:text-[#B7F34A] transition-colors truncate">
                      {prod.title}
                    </h4>
                  </div>
                  <span className="text-xs text-slate-400 block truncate">{prod.category}</span>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-sm font-bold text-white block">
                    Rs. {Math.round(prod.pricePKR).toLocaleString()}
                  </span>
                  <span className="text-[10px] text-slate-400">PKR</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-[#B7F34A] transition-colors shrink-0" />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
