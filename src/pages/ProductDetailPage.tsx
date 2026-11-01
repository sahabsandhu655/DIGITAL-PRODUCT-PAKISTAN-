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
  Zap,
  Phone,
  ChevronLeft,
  ChevronRight,
  Layers,
  ExternalLink
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
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);
  const [galleryViewMode, setGalleryViewMode] = useState<'slideshow' | 'grid'>('slideshow');

  const isAvailable = product.status === 'published' && product.pricePKR > 0;
  const whatsappNumber = '+923107759274';
  const whatsappDisplay = '+92 310 7759274';

  const orderMessage = encodeURIComponent(
    `Salam Muhammad Kumail Ali! I want to order *${product.title}* (Price: Rs. ${Math.round(product.pricePKR).toLocaleString()} PKR) from Digital Product Pakistan. Please share the payment and activation details.`
  );
  const whatsappOrderUrl = `https://wa.me/923107759274?text=${orderMessage}`;

  const relatedProducts = allProducts
    .filter(p => p.id !== product.id)
    .slice(0, 3);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const featureSlides = product.featureSlides || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Back Button & Breadcrumbs */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-[#B7F34A] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Catalog</span>
        </button>

        {/* Official WhatsApp Quick Direct Badge */}
        <a
          href={whatsappOrderUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 bg-[#1A2924] border border-[#25D366]/40 hover:border-[#25D366] text-[#25D366] text-xs font-bold px-3 py-1.5 rounded-full transition-all"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          <span>WhatsApp Business: {whatsappDisplay}</span>
        </a>
      </div>

      {/* Prominent WhatsApp Ordering Notice Banner */}
      <div className="bg-gradient-to-r from-[#173024] via-[#12231c] to-[#173024] border border-[#25D366]/40 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg shadow-black/20">
        <div className="flex items-center gap-3.5 text-left">
          <div className="w-12 h-12 rounded-2xl bg-[#25D366] flex items-center justify-center text-white shrink-0 shadow-md shadow-[#25D366]/30">
            <MessageCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-sm sm:text-base">
                Official WhatsApp Business Ordering Available
              </span>
              <span className="bg-[#25D366]/20 text-[#25D366] text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full">
                Active 24/7
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Direct delivery & setup assistance with Founder Muhammad Kumail Ali at <span className="font-mono text-white font-semibold">{whatsappDisplay}</span>
            </p>
          </div>
        </div>

        <a
          href={whatsappOrderUrl}
          target="_blank"
          rel="noreferrer"
          className="shrink-0 bg-[#25D366] hover:bg-[#20ba59] text-white font-extrabold text-xs sm:text-sm px-5 py-3 rounded-xl flex items-center gap-2 shadow-lg shadow-[#25D366]/20 active:scale-95 transition-all"
        >
          <MessageCircle className="w-4 h-4 fill-white/20" />
          <span>Order on WhatsApp Now</span>
        </a>
      </div>

      {/* Main Product Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
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
                Offer Verification Pending
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
              <span>Two Easy Ways to Order</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              1. <strong className="text-white">Direct on WhatsApp:</strong> Click the green button to chat directly with us on WhatsApp ({whatsappDisplay}) and pay via Easypaisa or JazzCash.<br />
              2. <strong className="text-white">Website Checkout:</strong> Add to cart and submit your Easypaisa screenshot for manual verification.
            </p>
          </div>
        </div>

        {/* Right Column: Title, Pricing & Actions */}
        <div className="lg:col-span-7 space-y-7">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="bg-[#1A2924] border border-[#233730] text-[#B7F34A] text-xs font-bold px-3 py-1 rounded-lg">
                {product.category}
              </span>
              {product.validity && (
                <span className="bg-[#15231F] text-slate-300 text-xs px-2.5 py-1 rounded-lg border border-[#233730] font-medium">
                  {product.validity}
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

          {/* Pricing & WhatsApp Direct Action Box */}
          <div className="bg-[#15231F] border border-[#233730] rounded-2xl p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#233730]">
              <div>
                <span className="text-xs text-slate-400 font-medium block">
                  Official Price in PKR
                </span>
                <div className="flex items-baseline gap-3 mt-1">
                  <span className="text-3xl sm:text-4xl font-extrabold text-[#B7F34A]">
                    Rs. {Math.round(product.pricePKR).toLocaleString()} PKR
                  </span>
                  {product.compareAtPricePKR && product.compareAtPricePKR > product.pricePKR && (
                    <span className="text-sm text-slate-500 line-through">
                      Rs. {Math.round(product.compareAtPricePKR).toLocaleString()}
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  All-inclusive pricing • Fast activation via WhatsApp ({whatsappDisplay})
                </span>
              </div>

              {/* Direct WhatsApp Call/Chat Quick Pill */}
              <a
                href={`tel:+923107759274`}
                className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white bg-[#1A2924] px-3 py-2 rounded-xl border border-[#233730] self-start sm:self-auto"
              >
                <Phone className="w-3.5 h-3.5 text-[#25D366]" />
                <span>Call/WhatsApp: {whatsappDisplay}</span>
              </a>
            </div>

            {/* ORDER ACTIONS */}
            <div className="space-y-3">
              {/* PRIMARY: ORDER ON WHATSAPP DIRECT */}
              <a
                href={whatsappOrderUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white font-extrabold text-base py-4 px-6 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-[#25D366]/25 active:scale-98"
              >
                <MessageCircle className="w-5 h-5 fill-white/20" />
                <span>ORDER ON WHATSAPP DIRECT ({whatsappDisplay})</span>
              </a>

              {/* SECONDARY: ON-SITE BUY NOW / ADD TO CART */}
              {isAvailable && (
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <button
                    onClick={() => onCheckoutNow(product)}
                    className="bg-[#B7F34A] hover:bg-[#A3E037] text-[#111C18] font-bold text-sm py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-[#B7F34A]/20 cursor-pointer active:scale-95"
                  >
                    <Zap className="w-4 h-4" />
                    <span>Pay via Easypaisa</span>
                  </button>

                  <button
                    onClick={() => addToCart(product)}
                    className="bg-[#1A2924] hover:bg-[#233730] text-white border border-[#233730] font-bold text-sm py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
                  >
                    <ShoppingBag className="w-4 h-4 text-[#B7F34A]" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Delivery & Specifications Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-[#15231F] border border-[#233730] rounded-xl p-4 space-y-1.5">
              <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#B7F34A]" /> Delivery & Setup
              </span>
              <p className="text-xs text-white font-medium">
                {product.deliveryType || 'Direct WhatsApp delivery & setup'}
              </p>
            </div>

            <div className="bg-[#15231F] border border-[#233730] rounded-xl p-4 space-y-1.5">
              <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" /> Official WhatsApp Number
              </span>
              <a 
                href={whatsappOrderUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-[#25D366] hover:underline font-bold block"
              >
                {whatsappDisplay} (Click to Chat)
              </a>
            </div>
          </div>

          {/* Features Checklist */}
          {product.features && product.features.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-[#233730]">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Key Highlights
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
              Tool Overview & Details
            </h3>
            <div className="text-sm text-slate-300 leading-relaxed space-y-3 whitespace-pre-line">
              {product.description}
            </div>
          </div>

          {/* Licensing & Warranty Note */}
          {product.licensingNotes && (
            <div className="bg-[#162420] border border-[#233730] rounded-2xl p-4 flex items-start gap-3 text-xs text-slate-300">
              <AlertTriangle className="w-4 h-4 text-[#B7F34A] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white block">Warranty & License Terms</span>
                <p className="text-slate-400 mt-0.5 leading-relaxed">
                  {product.licensingNotes}
                </p>
              </div>
            </div>
          )}

          {/* Share & WhatsApp Contact */}
          <div className="flex items-center gap-4 pt-4 border-t border-[#233730]">
            <button
              onClick={handleShare}
              className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1.5 cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copiedLink ? 'Link Copied!' : 'Share Tool'}</span>
            </button>
            <a
              href={whatsappOrderUrl}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-semibold text-[#25D366] hover:underline flex items-center gap-1.5"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Order via WhatsApp ({whatsappDisplay})</span>
            </a>
          </div>
        </div>
      </div>

      {/* FEATURE SHOWCASE GALLERY */}
      {featureSlides.length > 0 && (
        <section className="pt-12 border-t border-[#233730] space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#1A2924] border border-[#25D366]/40 text-[#25D366] text-xs font-bold px-3 py-1 rounded-full mb-2">
                <Layers className="w-3.5 h-3.5" />
                <span>Feature Visual Showcase ({featureSlides.length} Key Views)</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Explore Core Capabilities with Illustrated Walkthrough
              </h2>
              <p className="text-sm text-slate-400 mt-1 max-w-2xl">
                See real tool screenshots and capabilities before ordering. All licenses are backed by direct WhatsApp support.
              </p>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 bg-[#15231F] border border-[#233730] p-1 rounded-xl self-start sm:self-auto">
              <button
                onClick={() => setGalleryViewMode('slideshow')}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  galleryViewMode === 'slideshow' ? 'bg-[#B7F34A] text-[#111C18]' : 'text-slate-400 hover:text-white'
                }`}
              >
                Interactive Slideshow
              </button>
              <button
                onClick={() => setGalleryViewMode('grid')}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  galleryViewMode === 'grid' ? 'bg-[#B7F34A] text-[#111C18]' : 'text-slate-400 hover:text-white'
                }`}
              >
                All {featureSlides.length} Features Grid
              </button>
            </div>
          </div>

          {/* SLIDESHOW VIEW */}
          {galleryViewMode === 'slideshow' && (
            <div className="bg-[#15231F] border border-[#233730] rounded-3xl overflow-hidden shadow-2xl">
              {/* Featured Slide Display */}
              <div className="relative aspect-video sm:aspect-[21/9] w-full bg-[#0B1311] overflow-hidden">
                <img
                  src={featureSlides[activeSlideIndex]?.imageUrl}
                  alt={featureSlides[activeSlideIndex]?.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111C18] via-transparent to-black/30" />

                {/* Slide Counter Badge */}
                <div className="absolute top-4 left-4 bg-[#111C18]/90 backdrop-blur-md border border-[#233730] text-[#B7F34A] font-extrabold text-xs px-3 py-1.5 rounded-xl shadow-lg">
                  Slide {activeSlideIndex + 1} of {featureSlides.length}
                </div>

                {/* Previous & Next Navigation overlay buttons */}
                <button
                  onClick={() => setActiveSlideIndex((prev) => (prev > 0 ? prev - 1 : featureSlides.length - 1))}
                  aria-label="Previous Feature Slide"
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-[#111C18]/85 hover:bg-[#B7F34A] hover:text-[#111C18] text-white border border-[#233730] flex items-center justify-center transition-all cursor-pointer shadow-xl"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                <button
                  onClick={() => setActiveSlideIndex((prev) => (prev < featureSlides.length - 1 ? prev + 1 : 0))}
                  aria-label="Next Feature Slide"
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-[#111C18]/85 hover:bg-[#B7F34A] hover:text-[#111C18] text-white border border-[#233730] flex items-center justify-center transition-all cursor-pointer shadow-xl"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>

                {/* Slide Title & Description on Image */}
                <div className="absolute bottom-6 left-6 right-6 max-w-3xl">
                  <span className="text-[11px] font-bold text-[#B7F34A] uppercase tracking-wider block mb-1">
                    Feature Walkthrough • Picture {activeSlideIndex + 1}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
                    {featureSlides[activeSlideIndex]?.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-200 mt-2 leading-relaxed bg-[#111C18]/80 backdrop-blur-md p-3 rounded-xl border border-[#233730]/80">
                    {featureSlides[activeSlideIndex]?.description}
                  </p>
                </div>
              </div>

              {/* Feature Slides Thumbnail Selector Strip */}
              <div className="p-4 bg-[#111C18] border-t border-[#233730]">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-slate-400">
                    Click any view below to inspect (1 to {featureSlides.length}):
                  </span>
                  <a
                    href={whatsappOrderUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold text-[#25D366] hover:underline flex items-center gap-1"
                  >
                    <span>Order on WhatsApp</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  {featureSlides.map((slide, idx) => (
                    <button
                      key={slide.id || idx}
                      onClick={() => setActiveSlideIndex(idx)}
                      className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                        activeSlideIndex === idx
                          ? 'border-[#B7F34A] scale-105 shadow-md shadow-[#B7F34A]/20'
                          : 'border-[#233730] opacity-50 hover:opacity-100'
                      }`}
                      title={slide.title}
                    >
                      <img src={slide.imageUrl} alt={slide.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center font-bold text-xs text-white">
                        {idx + 1}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* GRID VIEW (ALL 18 FEATURES CARDS) */}
          {galleryViewMode === 'grid' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featureSlides.map((slide, idx) => (
                <div
                  key={slide.id || idx}
                  className="bg-[#15231F] border border-[#233730] hover:border-[#B7F34A]/40 rounded-2xl overflow-hidden transition-all flex flex-col justify-between shadow-lg"
                >
                  <div className="relative h-48 w-full bg-[#0E1714]">
                    <img src={slide.imageUrl} alt={slide.title} className="w-full h-full object-cover" />
                    <div className="absolute top-3 left-3 bg-[#111C18]/90 text-[#B7F34A] text-xs font-extrabold px-2.5 py-1 rounded-lg border border-[#233730]">
                      #{idx + 1} of 18
                    </div>
                  </div>
                  <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-white text-sm">
                        {slide.title}
                      </h4>
                      <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                        {slide.description}
                      </p>
                    </div>
                    <div className="pt-3 border-t border-[#233730]/60 flex items-center justify-between text-[11px] text-slate-400">
                      <span className="text-[#B7F34A] font-semibold">Included in License</span>
                      <a
                        href={whatsappOrderUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#25D366] hover:underline font-bold"
                      >
                        Order Tool
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6 pt-12 border-t border-[#233730]">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-extrabold text-white">
              Other Software & Digital Tools
            </h2>
            <button
              onClick={onBack}
              className="text-xs font-bold text-[#B7F34A] hover:underline cursor-pointer"
            >
              View Full Catalog
            </button>
          </div>
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
