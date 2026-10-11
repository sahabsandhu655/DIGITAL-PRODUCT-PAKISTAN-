import React, { useState, useMemo } from 'react';
import { Search, Filter, BookOpen, SlidersHorizontal } from 'lucide-react';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';

interface EbooksPageProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  initialQuery?: string;
}

export const EbooksPage: React.FC<EbooksPageProps> = ({ 
  products, 
  onSelectProduct,
  initialQuery = '' 
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>(initialQuery);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'title'>('featured');

  const categories = [
    'All',
    'Business Books',
    'Novels',
    'Entrepreneurship Books',
    'Dating Books',
    'Romantic Books',
  ];

  const ebookProducts = useMemo(() => {
    return products.filter(p => p.productType === 'ebook');
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = ebookProducts.filter(p => {
      const matchCategory = selectedCategory === 'All' || p.category === selectedCategory;
      const matchSearch = searchQuery.trim() === '' || 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.shortDescription && p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCategory && matchSearch;
    });

    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.pricePKR - b.pricePKR);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.pricePKR - a.pricePKR);
    } else if (sortBy === 'title') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }

    return result;
  }, [ebookProducts, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Page Header */}
      <div className="border-b border-[#233730] pb-8">
        <div className="flex items-center gap-2 text-xs font-bold text-[#B7F34A] uppercase tracking-wider mb-2">
          <BookOpen className="w-4 h-4" />
          <span>Digital Library</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          E-Books & Reading Catalog
        </h1>
        <p className="mt-2 text-sm text-slate-300 max-w-2xl">
          Curated business guides, romantic and narrative novels, entrepreneurship manuals, and personal development books in instant downloadable format.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#15231F] border border-[#233730] rounded-2xl p-4 sm:p-6 space-y-4">
        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#B7F34A] text-[#111C18] shadow-md shadow-[#B7F34A]/20'
                  : 'bg-[#1A2924] text-slate-300 hover:text-white hover:bg-[#233730]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search & Sort Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-4 pt-2 border-t border-[#233730]">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, author, or keywords..."
              className="w-full bg-[#1A2924] border border-[#233730] focus:border-[#B7F34A] rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-slate-400 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
            <SlidersHorizontal className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="bg-[#1A2924] border border-[#233730] rounded-xl px-3 py-2 text-xs font-medium text-slate-300 focus:outline-none focus:border-[#B7F34A] w-full sm:w-auto"
            >
              <option value="featured">Featured First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="title">Alphabetical (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-[#15231F] border border-[#233730] rounded-2xl p-12 text-center text-slate-400 space-y-3">
          <BookOpen className="w-10 h-10 mx-auto text-slate-500" />
          <h3 className="text-base font-bold text-white">No e-books found</h3>
          <p className="text-xs">Try selecting a different category or clearing your search keywords.</p>
          <button
            onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
            className="mt-2 bg-[#B7F34A] text-[#111C18] text-xs font-bold px-4 py-2 rounded-xl cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} onSelect={onSelectProduct} />
          ))}
        </div>
      )}
    </div>
  );
};
