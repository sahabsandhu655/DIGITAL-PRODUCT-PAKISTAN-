import React, { useState } from 'react';
import { 
  ShoppingBag, 
  ArrowLeft, 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  FileText, 
  AlertTriangle, 
  Share2, 
  MessageCircle,
  Sparkles,
  Zap
} from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { ProductCard } from '../components/ProductCard';

interface ProductDetailPageProps {
  product: Product;
  allProducts: Product[];
  onBack: () => void;
  onSelectProduct: (product: Product) => void;
  onCheckoutNow: (product: Product) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  allProducts,
  onBack,
  onSelectProduct,
  onCheckoutNow,
}) => {
  const { addToCart } = useCart();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);

  const isAvailable = product.status === 'published' && product.pricePKR > 0;

  const relatedProducts = allProducts
    .filter(p => p.id !== product.id && (p.category === product.category || p.productType === product.productType))
    .slice(0, 3);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-[#B7F34A] transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Catalog</span>
      </button>

      {/* Main Product Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Images & Gallery */}
        <div className="lg:col-span-5 space-y-4">
          <div className="aspect-square rounded-3xl overflow-hidden bg-[#15231F] border border-[#233730] shadow-2xl relative">
            <img
              src={product.images[selectedImageIndex] || product.images[0]}
              alt={product.title}
              className="w-full h-full object-cover"
            />
            {!isAvailable && (
              <div className="absolute top-4 right-4 bg-amber-500 text-[#111C18] text-xs font-bold px-3 py-1 rounded-full shadow-md">
                Unpublished Draft / Offer Verification Pending
              </div>
            )}
          </div>

          {/* Thumbnails if multiple images */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-18 h-18 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                    selectedImageIndex === idx ? 'border-[#B7F34A]' : 'border-[#233730] opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Trust Box */}
          <div className="bg-[#15231F] border border-[#233730] rounded-2xl p-4 space-y-2 text-xs text-slate-300">
            <div className="flex items-center gap-2 text-white font-semibold">
              <ShieldCheck className="w-4 h-4 text-[#B7F34A]" />
              <span>Manual Easypaisa Order Verification</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Every payment is manually matched against our Easypaisa statement. Your access credentials or download links will be delivered to your WhatsApp and Email.
            </p>
          </div>
        </div>

        {/* Right Column: Title, Pricing & Actions */}
        <div className="lg:col-span-7 space-y-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="bg-[#1A2924] border border-[#233730] text-[#B7F34A] text-xs font-bold px-3 py-1 rounded-lg">
                {product.category}
              </span>
              {product.language && (
                <span className="bg-[#15231F] text-slate-400 text-xs px-2.5 py-1 rounded-lg border border-[#233730]">
                  Language: {product.language}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">
              {product.title}
            </h1>

            {product.shortDescription && (
              <p className="text-base text-slate-300 leading-relaxed">
                {product.shortDescription}
              </p>
            )}
          </div>

          {/* Pricing Box */}
          <div className="bg-[#15231F] border border-[#233730] rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <span className="text-xs text-slate-400 font-medium block">
                Total Amount Payable (PKR)
              </span>
              <div className="flex items-baseline gap-3 mt-1">
                <span className="text-3xl sm:text-4xl font-extrabold text-[#B7F34A]">
                  Rs. {Math.round(product.pricePKR).toLocaleString()}
                </span>
                {product.compareAtPricePKR && product.compareAtPricePKR > product.pricePKR && (
                  <span className="text-sm text-slate-400 line-through">
                    Rs. {Math.round(product.compareAtPricePKR).toLocaleString()}
                  </span>
                )}
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Tax inclusive • One-time purchase • No recurring fees
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {isAvailable ? (
                <>
                  <button
                    onClick={() => addToCart(product)}
                    className="bg-[#1A2924] hover:bg-[#233730] text-white border border-[#233730] font-bold text-sm px-6 py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
                  >
                    <ShoppingBag className="w-4 h-4 text-[#B7F34A]" />
                    <span>Add to Cart</span>
                  </button>
                  <button
                    onClick={() => onCheckoutNow(product)}
                    className="bg-[#B7F34A] hover:bg-[#A3E037] text-[#111C18] font-extrabold text-sm px-7 py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#B7F34A]/20 cursor-pointer active:scale-95"
                  >
                    <Zap className="w-4 h-4" />
                    <span>Buy Now</span>
                  </button>
                </>
              ) : (
                <div className="bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs p-3 rounded-xl">
                  This product is in draft review and cannot be ordered online at this time.
                </div>
              )}
            </div>
          </div>

          {/* Delivery & Specifications Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-[#15231F] border border-[#233730] rounded-xl p-4 space-y-1.5">
              <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#B7F34A]" /> Delivery Method
              </span>
              <p className="text-xs text-white font-medium">
                {product.deliveryType || 'Direct WhatsApp & Email download link'}
              </p>
            </div>

            {product.validity && (
              <div className="bg-[#15231F] border border-[#233730] rounded-xl p-4 space-y-1.5">
                <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#B7F34A]" /> Plan Validity / Access
                </span>
                <p className="text-xs text-white font-medium">
                  {product.validity}
                </p>
              </div>
            )}
          </div>

          {/* Features Checklist */}
          {product.features && product.features.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-[#233730]">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                What's Included
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {product.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-[#B7F34A] shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Full Description */}
          <div className="space-y-3 pt-6 border-t border-[#233730]">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Product Overview & Specifications
            </h3>
            <div className="text-sm text-slate-300 leading-relaxed space-y-3 whitespace-pre-line">
              {product.description}
            </div>
          </div>

          {/* Licensing & Third Party Disclosures */}
          {product.licensingNotes && (
            <div className="bg-[#162420] border border-[#233730] rounded-2xl p-4 flex items-start gap-3 text-xs text-slate-300">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-amber-300 block">Licensing Notice</span>
                <p className="text-slate-400 mt-0.5 leading-relaxed">
                  {product.licensingNotes}
                </p>
              </div>
            </div>
          )}

          {/* Share & Support actions */}
          <div className="flex items-center gap-4 pt-4 border-t border-[#233730]">
            <button
              onClick={handleShare}
              className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1.5 cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copiedLink ? 'Link Copied!' : 'Share Product'}</span>
            </button>
            <a
              href={`https://wa.me/923107759274?text=${encodeURIComponent(`Hi, I am interested in ${product.title} (PKR ${product.pricePKR}). Can you share more details?`)}`}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-semibold text-[#B7F34A] hover:underline flex items-center gap-1.5"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Inquire on WhatsApp (+92 310 7759274)</span>
            </a>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="space-y-8 pt-12 border-t border-[#233730]">
          <h2 className="text-2xl font-extrabold text-white">
            Related Digital Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedProducts.map((rel) => (
              <ProductCard key={rel.id} product={rel} onSelect={onSelectProduct} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
