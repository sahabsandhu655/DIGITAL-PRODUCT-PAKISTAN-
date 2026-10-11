import React from 'react';
import { ShoppingBag, ArrowRight, BookOpen, Cpu, GraduationCap, CheckCircle2 } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const { addToCart } = useCart();

  const getProductIcon = () => {
    switch (product.productType) {
      case 'ebook':
        return <BookOpen className="w-3.5 h-3.5" />;
      case 'software':
        return <Cpu className="w-3.5 h-3.5" />;
      case 'course':
        return <GraduationCap className="w-3.5 h-3.5" />;
      default:
        return null;
    }
  };

  const isAvailable = product.status === 'published';

  return (
    <div className="group bg-[#15231F] border border-[#233730] hover:border-[#B7F34A]/50 rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl hover:shadow-[#B7F34A]/5">
      {/* Product Image / Thumbnail */}
      <div 
        onClick={() => onSelect(product)}
        className="relative h-48 sm:h-52 w-full overflow-hidden bg-[#0E1714] cursor-pointer"
      >
        <img
          src={product.images[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80'}
          alt={product.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#15231F] via-transparent to-transparent opacity-80" />

        {/* Category Pill */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className="inline-flex items-center gap-1 bg-[#111C18]/90 backdrop-blur-md border border-[#233730] text-[#B7F34A] text-xs font-semibold px-2.5 py-1 rounded-lg">
            {getProductIcon()}
            <span>{product.category}</span>
          </span>
        </div>

        {/* Status indicator if Draft */}
        {!isAvailable && (
          <div className="absolute top-3 right-3 bg-amber-500/90 text-[#111C18] text-xs font-bold px-2 py-0.5 rounded-md shadow-sm">
            Draft / Unverified
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          {product.language && (
            <span className="text-[11px] font-medium text-slate-400 block">
              Language: {product.language}
            </span>
          )}

          <h3 
            onClick={() => onSelect(product)}
            className="font-bold text-base sm:text-lg text-white group-hover:text-[#B7F34A] transition-colors line-clamp-1 cursor-pointer"
            title={product.title}
          >
            {product.title}
          </h3>

          <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
            {product.shortDescription || product.description}
          </p>

          {/* Key Feature bullet */}
          {product.features && product.features.length > 0 && (
            <div className="pt-1 flex items-center gap-1.5 text-xs text-slate-400">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#B7F34A] shrink-0" />
              <span className="truncate">{product.features[0]}</span>
            </div>
          )}
        </div>

        {/* Pricing & Actions */}
        <div className="pt-5 mt-4 border-t border-[#233730]/70 flex items-center justify-between gap-3">
          <div>
            <span className="block text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
              Price (PKR)
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-extrabold text-white">
                Rs. {Math.round(product.pricePKR).toLocaleString()}
              </span>
              {product.compareAtPricePKR && product.compareAtPricePKR > product.pricePKR && (
                <span className="text-xs text-slate-500 line-through">
                  Rs. {Math.round(product.compareAtPricePKR).toLocaleString()}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onSelect(product)}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-[#1A2924] transition-colors cursor-pointer"
              title="View details"
              aria-label={`View details for ${product.title}`}
            >
              <ArrowRight className="w-4 h-4" />
            </button>

            {isAvailable ? (
              <button
                onClick={() => addToCart(product)}
                className="bg-[#B7F34A] hover:bg-[#A3E037] text-[#111C18] font-bold text-xs px-3.5 py-2.5 rounded-xl flex items-center gap-1.5 transition-all active:scale-95 shadow-md shadow-[#B7F34A]/10 cursor-pointer"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            ) : (
              <button
                onClick={() => onSelect(product)}
                className="bg-[#233730] text-slate-400 font-medium text-xs px-3 py-2 rounded-xl cursor-pointer hover:text-white"
              >
                Details
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
