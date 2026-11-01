import React from 'react';
import { ShoppingBag, ArrowRight, Cpu, Sparkles, CheckCircle2, MessageCircle } from 'lucide-react';
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
      case 'tool':
        return <Sparkles className="w-3.5 h-3.5" />;
      case 'software':
      default:
        return <Cpu className="w-3.5 h-3.5" />;
    }
  };

  const isAvailable = product.status === 'published';

  const whatsappMessage = encodeURIComponent(
    `Salam! I want to order *${product.title}* (Rs. ${Math.round(product.pricePKR).toLocaleString()} PKR) from Digital Product Pakistan. Please share payment and activation details.`
  );
  const whatsappUrl = `https://wa.me/923107759274?text=${whatsappMessage}`;

  return (
    <div className="group bg-[#15231F] border border-[#233730] hover:border-[#B7F34A]/50 rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl hover:shadow-[#B7F34A]/5">
      {/* Product Image / Thumbnail */}
      <div 
        onClick={() => onSelect(product)}
        className="relative h-48 sm:h-52 w-full overflow-hidden bg-[#0E1714] cursor-pointer"
      >
        <img
          src={product.images[0] || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80'}
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
          {product.validity && (
            <span className="text-[11px] font-semibold text-[#B7F34A] block uppercase tracking-wider">
              {product.validity}
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
            <div className="pt-1 flex items-center gap-1.5 text-xs text-slate-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#B7F34A] shrink-0" />
              <span className="truncate">{product.features[0]}</span>
            </div>
          )}

          {/* WhatsApp Direct Help Banner */}
          <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400">
            <a 
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-[#25D366] hover:underline flex items-center gap-1 font-medium"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp: +92 310 7759274</span>
            </a>
            {product.featureSlides && (
              <span className="bg-[#1A2924] border border-[#233730] text-[#B7F34A] text-[10px] font-bold px-1.5 py-0.5 rounded">
                18 Visual Features
              </span>
            )}
          </div>
        </div>

        {/* Pricing & Actions */}
        <div className="pt-4 mt-4 border-t border-[#233730]/70 space-y-3">
          <div className="flex items-center justify-between">
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

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onSelect(product)}
                className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-[#1A2924] transition-colors cursor-pointer"
                title="View details & features"
                aria-label={`View details for ${product.title}`}
              >
                <ArrowRight className="w-4 h-4" />
              </button>

              {isAvailable && (
                <button
                  onClick={() => addToCart(product)}
                  className="bg-[#1A2924] hover:bg-[#233730] text-white border border-[#233730] font-semibold text-xs px-2.5 py-2 rounded-xl flex items-center gap-1 transition-all active:scale-95 cursor-pointer"
                  title="Add to shopping cart"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-[#B7F34A]" />
                  <span>Cart</span>
                </button>
              )}
            </div>
          </div>

          {/* Direct "Order on WhatsApp" Button */}
          {isAvailable ? (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-[#25D366]/20 active:scale-95"
            >
              <MessageCircle className="w-4 h-4 fill-white/20" />
              <span>Order on WhatsApp Direct</span>
            </a>
          ) : (
            <button
              onClick={() => onSelect(product)}
              className="w-full bg-[#233730] text-slate-400 font-medium text-xs py-2 rounded-xl cursor-pointer hover:text-white"
            >
              View Specifications
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
