import React, { useState, useMemo } from 'react';
import { Search, GraduationCap, Globe, BookOpen, Layers } from 'lucide-react';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';

interface CoursesPageProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export const CoursesPage: React.FC<CoursesPageProps> = ({ products, onSelectProduct }) => {
  const [selectedLanguage, setSelectedLanguage] = useState<string>('All');
  const [selectedCollection, setSelectedCollection] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const courseProducts = useMemo(() => {
    return products.filter(p => p.productType === 'course');
  }, [products]);

  const filtered = useMemo(() => {
    return courseProducts.filter(p => {
      const matchSearch = searchQuery.trim() === '' ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchLang = selectedLanguage === 'All' || 
        (p.language && p.language.toLowerCase().includes(selectedLanguage.toLowerCase()));

      const matchColl = selectedCollection === 'All' || p.category === selectedCollection;

      return matchSearch && matchLang && matchColl;
    });
  }, [courseProducts, searchQuery, selectedLanguage, selectedCollection]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="border-b border-[#233730] pb-8">
        <div className="flex items-center gap-2 text-xs font-bold text-[#B7F34A] uppercase tracking-wider mb-2">
          <GraduationCap className="w-4 h-4" />
          <span>Academy & Skill Masterclasses</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          Online Courses & Skill Vaults
        </h1>
        <p className="mt-2 text-sm text-slate-300 max-w-2xl leading-relaxed">
          Comprehensive project-driven courses in Web Development, Graphic Design, Video Editing, E-commerce, and Digital Marketing taught in English, Urdu, and Hindi.
        </p>

        {/* Featured Big Collections Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          <div 
            onClick={() => { setSelectedCollection('500+ English Courses'); setSelectedLanguage('All'); }}
            className={`p-6 rounded-2xl border transition-all cursor-pointer ${
              selectedCollection === '500+ English Courses'
                ? 'bg-[#1A2924] border-[#B7F34A]'
                : 'bg-[#15231F] border-[#233730] hover:border-slate-500'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-[#B7F34A] uppercase tracking-wider">English Collection</span>
              <span className="text-xs bg-[#111C18] text-slate-300 px-2.5 py-1 rounded-full border border-[#233730]">Lifetime Archive</span>
            </div>
            <h3 className="text-xl font-bold text-white">500+ English Courses Master Bundle</h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Curated international masterclasses covering programming, artificial intelligence, copywriting, and enterprise software.
            </p>
          </div>

          <div 
            onClick={() => { setSelectedCollection('2,000+ Hindi and Urdu Courses'); setSelectedLanguage('All'); }}
            className={`p-6 rounded-2xl border transition-all cursor-pointer ${
              selectedCollection === '2,000+ Hindi and Urdu Courses'
                ? 'bg-[#1A2924] border-[#B7F34A]'
                : 'bg-[#15231F] border-[#233730] hover:border-slate-500'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-[#B7F34A] uppercase tracking-wider">Regional Collection</span>
              <span className="text-xs bg-[#111C18] text-slate-300 px-2.5 py-1 rounded-full border border-[#233730]">Urdu & Hindi</span>
            </div>
            <h3 className="text-xl font-bold text-white">2,000+ Hindi & Urdu Courses Mega Vault</h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Native South Asian instruction for CapCut, Photoshop, Shopify, Amazon FBA, and freelancing without English language friction.
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#15231F] border border-[#233730] rounded-2xl p-4 sm:p-6 space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400 font-semibold mr-2 flex items-center gap-1">
            <Globe className="w-3.5 h-3.5" /> Language:
          </span>
          {['All', 'English', 'Urdu', 'Hindi'].map((lang) => (
            <button
              key={lang}
              onClick={() => setSelectedLanguage(lang)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                selectedLanguage === lang
                  ? 'bg-[#B7F34A] text-[#111C18] font-bold'
                  : 'bg-[#1A2924] text-slate-300 hover:text-white'
              }`}
            >
              {lang}
            </button>
          ))}

          <span className="text-xs text-slate-400 font-semibold ml-auto mr-2 hidden sm:inline">
            Collection Filter:
          </span>
          <button
            onClick={() => setSelectedCollection('All')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
              selectedCollection === 'All'
                ? 'bg-[#233730] text-white font-bold'
                : 'bg-[#1A2924] text-slate-400 hover:text-white'
            }`}
          >
            Show All Courses
          </button>
        </div>

        <div className="pt-2 border-t border-[#233730] flex items-center">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search courses by skill (e.g. video editing, python, graphic design)..."
              className="w-full bg-[#1A2924] border border-[#233730] focus:border-[#B7F34A] rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-slate-400 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((prod) => (
          <ProductCard key={prod.id} product={prod} onSelect={onSelectProduct} />
        ))}
      </div>
    </div>
  );
};
