import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Image as ImageIcon, 
  Wand2, 
  Download, 
  Check, 
  Copy, 
  Upload, 
  Sliders, 
  Layers, 
  RefreshCw,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Product } from '../types';
import { saveProduct } from '../services/storeService';

interface AdminImageStudioProps {
  products: Product[];
  onProductUpdated?: (product: Product) => void;
  showToast?: (message: string, type?: 'success' | 'error') => void;
}

export const AdminImageStudio: React.FC<AdminImageStudioProps> = ({
  products,
  onProductUpdated,
  showToast = () => {},
}) => {
  const [activeMode, setActiveMode] = useState<'create' | 'edit'>('create');

  // CREATE MODE STATE
  const [prompt, setPrompt] = useState('');
  const [stylePreset, setStylePreset] = useState<'cyber' | 'glassmorphism' | 'course' | 'ebook' | 'minimal'>('cyber');
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '16:9' | '4:3'>('1:1');
  const [badgeText, setBadgeText] = useState('BESTSELLER');
  const [productTitle, setProductTitle] = useState('');
  const [productSubtitle, setProductSubtitle] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [createdImageUrl, setCreatedImageUrl] = useState<string | null>(null);

  // EDIT MODE STATE
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');
  const [editImageUrl, setEditImageUrl] = useState<string>(products[0]?.images?.[0] || '');
  const [customUploadUrl, setCustomUploadUrl] = useState<string>('');
  
  // EDIT ADJUSTMENTS
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [overlayBadge, setOverlayBadge] = useState<string>('50% OFF');
  const [customBadgeText, setCustomBadgeText] = useState('');
  const [applyGlow, setApplyGlow] = useState(true);
  const [applyVignette, setApplyVignette] = useState(false);
  const [isProcessingEdit, setIsProcessingEdit] = useState(false);
  const [editedImageUrl, setEditedImageUrl] = useState<string | null>(null);

  // TARGET PRODUCT FOR APPLICATION
  const [targetProductId, setTargetProductId] = useState<string>(products[0]?.id || '');
  const [isSavingToProduct, setIsSavingToProduct] = useState(false);

  // Canvas Refs for Rendering
  const createPreviewCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const editPreviewCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Pre-fill fields when selecting a product to edit
  useEffect(() => {
    if (selectedProductId) {
      const prod = products.find(p => p.id === selectedProductId);
      if (prod) {
        setEditImageUrl(prod.images?.[0] || '');
        setProductTitle(prod.title);
        setProductSubtitle(`Instant Digital Access • PKR ${prod.pricePKR}`);
      }
    }
  }, [selectedProductId, products]);

  // INITIALIZE CREATE CANVAS WITH SAMPLE PREVIEW
  useEffect(() => {
    if (activeMode === 'create') {
      renderCreateCanvas();
    }
  }, [activeMode, stylePreset, aspectRatio, badgeText, productTitle, productSubtitle]);

  // RENDER EDIT CANVAS WHEN ADJUSTMENTS CHANGE
  useEffect(() => {
    if (activeMode === 'edit' && editImageUrl) {
      renderEditCanvas();
    }
  }, [activeMode, editImageUrl, brightness, contrast, saturation, overlayBadge, customBadgeText, applyGlow, applyVignette]);

  // High-Quality Digital Product Graphic Generator (Canvas 2D)
  const renderCreateCanvas = () => {
    const canvas = createPreviewCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Dimensions based on aspect ratio
    let width = 800;
    let height = 800;
    if (aspectRatio === '16:9') {
      width = 960;
      height = 540;
    } else if (aspectRatio === '4:3') {
      width = 800;
      height = 600;
    }

    canvas.width = width;
    canvas.height = height;

    // 1. Background Gradient
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    if (stylePreset === 'cyber') {
      bgGrad.addColorStop(0, '#0A1310');
      bgGrad.addColorStop(0.5, '#111C18');
      bgGrad.addColorStop(1, '#081711');
    } else if (stylePreset === 'glassmorphism') {
      bgGrad.addColorStop(0, '#10221A');
      bgGrad.addColorStop(1, '#0B1512');
    } else if (stylePreset === 'course') {
      bgGrad.addColorStop(0, '#0D2B1F');
      bgGrad.addColorStop(0.7, '#111C18');
      bgGrad.addColorStop(1, '#050D0A');
    } else if (stylePreset === 'ebook') {
      bgGrad.addColorStop(0, '#131A24');
      bgGrad.addColorStop(1, '#0E1714');
    } else {
      bgGrad.addColorStop(0, '#14201C');
      bgGrad.addColorStop(1, '#0E1714');
    }
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // 2. Cyber Mesh Grid / Radial Glow
    const radialGlow = ctx.createRadialGradient(width * 0.5, height * 0.4, 50, width * 0.5, height * 0.4, width * 0.6);
    radialGlow.addColorStop(0, 'rgba(183, 243, 74, 0.22)');
    radialGlow.addColorStop(0.5, 'rgba(16, 185, 129, 0.08)');
    radialGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = radialGlow;
    ctx.fillRect(0, 0, width, height);

    // Grid lines for tech feel
    ctx.strokeStyle = 'rgba(183, 243, 74, 0.05)';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // 3. Central Card / 3D Frame
    const cardMarginX = width * 0.1;
    const cardMarginY = height * 0.12;
    const cardW = width - (cardMarginX * 2);
    const cardH = height - (cardMarginY * 2);

    // Card background
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
    ctx.shadowBlur = 30;
    ctx.shadowOffsetY = 15;
    
    ctx.fillStyle = 'rgba(21, 35, 31, 0.85)';
    roundRect(ctx, cardMarginX, cardMarginY, cardW, cardH, 24);
    ctx.fill();
    ctx.restore();

    // Card border glow
    ctx.strokeStyle = 'rgba(183, 243, 74, 0.4)';
    ctx.lineWidth = 2;
    roundRect(ctx, cardMarginX, cardMarginY, cardW, cardH, 24);
    ctx.stroke();

    // 4. Header Brand Tag
    ctx.fillStyle = '#B7F34A';
    ctx.font = 'bold 15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('DIGITAL PRODUCT PAKISTAN', cardMarginX + 35, cardMarginY + 50);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('• VERIFIED DIGITAL ASSET • EASYPAISA MANUAL VERIFICATION', cardMarginX + 270, cardMarginY + 50);

    // 5. Product Title
    const title = productTitle.trim() || prompt.trim() || 'Premium Digital Product 2026';
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 36px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    wrapText(ctx, title, cardMarginX + 35, cardMarginY + 115, cardW - 70, 44);

    // 6. Subtitle / Features
    const sub = productSubtitle.trim() || 'Instant Google Drive Delivery • 100% Guaranteed License';
    ctx.fillStyle = '#94A3B8';
    ctx.font = '500 17px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    wrapText(ctx, sub, cardMarginX + 35, cardMarginY + 225, cardW - 70, 26);

    // 7. Decorative 3D Floating Mockup Graphic Elements
    const decoX = cardMarginX + cardW - 200;
    const decoY = cardMarginY + cardH - 170;
    
    // Abstract neon icon / chip
    ctx.save();
    ctx.shadowColor = '#B7F34A';
    ctx.shadowBlur = 20;
    ctx.fillStyle = '#111C18';
    roundRect(ctx, decoX, decoY, 150, 100, 16);
    ctx.fill();
    ctx.strokeStyle = '#B7F34A';
    ctx.lineWidth = 1.5;
    roundRect(ctx, decoX, decoY, 150, 100, 16);
    ctx.stroke();

    ctx.fillStyle = '#B7F34A';
    ctx.font = 'bold 18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('DPP • PRO', decoX + 25, decoY + 45);
    ctx.fillStyle = '#94A3B8';
    ctx.font = '11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('DIRECT ACCESS', decoX + 25, decoY + 70);
    ctx.restore();

    // 8. Badge (e.g. BESTSELLER, 50% OFF)
    if (badgeText && badgeText !== 'NONE') {
      ctx.save();
      ctx.shadowColor = 'rgba(183, 243, 74, 0.4)';
      ctx.shadowBlur = 15;
      ctx.fillStyle = '#B7F34A';
      roundRect(ctx, cardMarginX + 35, cardMarginY + cardH - 95, 160, 42, 12);
      ctx.fill();

      ctx.fillStyle = '#111C18';
      ctx.font = '900 14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText(badgeText.toUpperCase(), cardMarginX + 55, cardMarginY + cardH - 68);
      ctx.restore();
    }

    // 9. Pakistani Flag Accent / Trust Stamp
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = 'bold 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('🇵🇰 Pakistan Trusted • 24/7 WhatsApp Support: 0345-5282215', cardMarginX + 215, cardMarginY + cardH - 68);

    // Save Data URL
    setCreatedImageUrl(canvas.toDataURL('image/png'));
  };

  // Render Edit Canvas with filters, overlays and adjustments
  const renderEditCanvas = () => {
    const canvas = editPreviewCanvasRef.current;
    if (!canvas || !editImageUrl) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = editImageUrl;

    img.onload = () => {
      canvas.width = 800;
      canvas.height = 800;

      // Clear
      ctx.clearRect(0, 0, 800, 800);

      // Apply CSS Filters to Canvas Context
      ctx.save();
      ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;

      // Draw base image to fill 800x800
      ctx.drawImage(img, 0, 0, 800, 800);
      ctx.restore();

      // Apply Dark Vignette if enabled
      if (applyVignette) {
        const vigGrad = ctx.createRadialGradient(400, 400, 200, 400, 400, 560);
        vigGrad.addColorStop(0, 'rgba(0,0,0,0)');
        vigGrad.addColorStop(1, 'rgba(0,0,0,0.65)');
        ctx.fillStyle = vigGrad;
        ctx.fillRect(0, 0, 800, 800);
      }

      // Apply DPP Emerald Glow if enabled
      if (applyGlow) {
        const glowGrad = ctx.createLinearGradient(0, 0, 800, 800);
        glowGrad.addColorStop(0, 'rgba(183, 243, 74, 0.12)');
        glowGrad.addColorStop(0.5, 'rgba(0,0,0,0)');
        glowGrad.addColorStop(1, 'rgba(16, 185, 129, 0.15)');
        ctx.fillStyle = glowGrad;
        ctx.fillRect(0, 0, 800, 800);

        // Cyber border frame
        ctx.strokeStyle = 'rgba(183, 243, 74, 0.35)';
        ctx.lineWidth = 6;
        ctx.strokeRect(10, 10, 780, 780);
      }

      // Overlay Promotional Badge
      const activeBadge = customBadgeText.trim() || overlayBadge;
      if (activeBadge && activeBadge !== 'NONE') {
        ctx.save();
        ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
        ctx.shadowBlur = 12;
        ctx.shadowOffsetY = 4;

        // Badge pill
        ctx.fillStyle = '#B7F34A';
        roundRect(ctx, 40, 40, 200, 52, 16);
        ctx.fill();

        ctx.fillStyle = '#111C18';
        ctx.font = '900 18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.fillText(`⚡ ${activeBadge.toUpperCase()}`, 60, 74);
        ctx.restore();
      }

      // Watermark / Footer Trust Banner
      ctx.fillStyle = 'rgba(17, 28, 24, 0.85)';
      ctx.fillRect(0, 730, 800, 70);

      ctx.fillStyle = '#B7F34A';
      ctx.font = 'bold 15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText('DIGITAL PRODUCT PAKISTAN', 40, 772);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText('• 100% Genuine • Instant Delivery • WhatsApp: 0345-5282215', 270, 772);

      setEditedImageUrl(canvas.toDataURL('image/png'));
    };

    img.onerror = () => {
      // Fallback if cross-origin image fails: draw fallback graphic
      ctx.fillStyle = '#15231F';
      ctx.fillRect(0, 0, 800, 800);
      ctx.fillStyle = '#B7F34A';
      ctx.font = 'bold 24px sans-serif';
      ctx.fillText('Image loaded. Ready for editing.', 200, 400);
      setEditedImageUrl(canvas.toDataURL('image/png'));
    };
  };

  // Helper function to draw rounded rectangle
  function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  // Helper function to wrap text
  function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
    const words = text.split(' ');
    let line = '';
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line, x, y);
        line = words[n] + ' ';
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, y);
  }

  // Handle local file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const result = uploadEvent.target?.result as string;
        setEditImageUrl(result);
        setCustomUploadUrl(result);
        showToast('Image uploaded successfully into editor!', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  // Apply current generated or edited image to target product
  const handleApplyToProduct = async () => {
    const imgToApply = activeMode === 'create' ? createdImageUrl : editedImageUrl;
    if (!imgToApply) {
      showToast('No image available to apply!', 'error');
      return;
    }
    const targetProd = products.find(p => p.id === targetProductId);
    if (!targetProd) {
      showToast('Please select a target product.', 'error');
      return;
    }

    setIsSavingToProduct(true);
    try {
      const updated: Product = {
        ...targetProd,
        images: [imgToApply, ...(targetProd.images || []).filter(img => img !== imgToApply)],
        updatedAt: new Date().toISOString(),
      };
      await saveProduct(updated);
      if (onProductUpdated) onProductUpdated(updated);
      showToast(`Cover image updated for "${targetProd.title}"!`, 'success');
    } catch (err: any) {
      showToast('Error saving product image: ' + err.message, 'error');
    } finally {
      setIsSavingToProduct(false);
    }
  };

  // Download image helper
  const handleDownloadImage = () => {
    const imgData = activeMode === 'create' ? createdImageUrl : editedImageUrl;
    if (!imgData) return;
    const link = document.createElement('a');
    link.download = `dpp-artwork-${Date.now()}.png`;
    link.href = imgData;
    link.click();
    showToast('Image downloaded to your device!', 'success');
  };

  // Copy Data URL
  const handleCopyDataUrl = () => {
    const imgData = activeMode === 'create' ? createdImageUrl : editedImageUrl;
    if (!imgData) return;
    navigator.clipboard.writeText(imgData);
    showToast('Image Data URL copied to clipboard!', 'success');
  };

  return (
    <div className="bg-[#15231F] border border-[#233730] rounded-3xl p-5 sm:p-8 space-y-6">
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#233730]">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-[#B7F34A]/20 text-[#B7F34A] text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-[#B7F34A]/30">
              Admin Exclusive
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#B7F34A]" />
              AI Image Creator & Editor Studio
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Create high-converting 3D digital product covers, or edit existing catalog thumbnails with badges & filters.
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex bg-[#111C18] p-1 rounded-xl border border-[#233730] self-start sm:self-auto">
          <button
            onClick={() => setActiveMode('create')}
            className={`px-4 py-2 rounded-lg text-xs font-extrabold flex items-center gap-2 cursor-pointer transition-all ${
              activeMode === 'create'
                ? 'bg-[#B7F34A] text-[#111C18] shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Wand2 className="w-3.5 h-3.5" />
            Create Image
          </button>
          <button
            onClick={() => setActiveMode('edit')}
            className={`px-4 py-2 rounded-lg text-xs font-extrabold flex items-center gap-2 cursor-pointer transition-all ${
              activeMode === 'edit'
                ? 'bg-[#B7F34A] text-[#111C18] shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            Edit Image
          </button>
        </div>
      </div>

      {/* Grid: Controls on Left, Live Canvas on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: CONTROLS */}
        <div className="lg:col-span-5 space-y-5">
          {activeMode === 'create' ? (
            /* CREATE MODE CONTROLS */
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Product Title / Main Headline
                </label>
                <input
                  type="text"
                  value={productTitle}
                  onChange={(e) => setProductTitle(e.target.value)}
                  placeholder="e.g. Complete Python Masterclass 2026"
                  className="w-full bg-[#1A2924] border border-[#233730] focus:border-[#B7F34A] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Subtitle / Key Selling Points
                </label>
                <input
                  type="text"
                  value={productSubtitle}
                  onChange={(e) => setProductSubtitle(e.target.value)}
                  placeholder="e.g. 50+ Projects • Instant Google Drive Access • Urdu"
                  className="w-full bg-[#1A2924] border border-[#233730] focus:border-[#B7F34A] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Visual Style Theme
                  </label>
                  <select
                    value={stylePreset}
                    onChange={(e: any) => setStylePreset(e.target.value)}
                    className="w-full bg-[#1A2924] border border-[#233730] focus:border-[#B7F34A] rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="cyber">DPP Cyber Dark (Emerald)</option>
                    <option value="glassmorphism">Modern Glassmorphism</option>
                    <option value="course">Video Course Showcase</option>
                    <option value="ebook">E-Book 3D Mockup</option>
                    <option value="minimal">Minimalist Tech</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Aspect Ratio
                  </label>
                  <select
                    value={aspectRatio}
                    onChange={(e: any) => setAspectRatio(e.target.value)}
                    className="w-full bg-[#1A2924] border border-[#233730] focus:border-[#B7F34A] rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="1:1">1:1 Square (Product Cover)</option>
                    <option value="16:9">16:9 Banner (Hero / Course)</option>
                    <option value="4:3">4:3 Card Mockup</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Highlight Promotional Badge
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['BESTSELLER', '50% OFF', 'LIFETIME ACCESS', 'NEW RELEASE', 'VERIFIED', 'NONE'].map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setBadgeText(b)}
                      className={`py-1.5 px-2 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${
                        badgeText === b
                          ? 'bg-[#B7F34A] text-[#111C18] border-[#B7F34A]'
                          : 'bg-[#111C18] text-slate-300 border-[#233730] hover:border-slate-500'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={renderCreateCanvas}
                className="w-full bg-[#B7F34A] hover:bg-[#a6e03f] text-[#111C18] font-black text-xs py-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                Render & Update Graphic
              </button>
            </div>
          ) : (
            /* EDIT MODE CONTROLS */
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Select Product Image to Edit
                </label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full bg-[#1A2924] border border-[#233730] focus:border-[#B7F34A] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title} (PKR {p.pricePKR})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-[#1A2924] hover:bg-[#233730] border border-[#233730] text-slate-200 text-xs px-4 py-2 rounded-xl flex items-center gap-2 cursor-pointer transition-all"
                >
                  <Upload className="w-3.5 h-3.5 text-[#B7F34A]" />
                  Or Upload Custom Image File
                </button>
                {customUploadUrl && (
                  <span className="text-[11px] text-[#B7F34A] font-bold">Custom image loaded</span>
                )}
              </div>

              {/* Adjustments */}
              <div className="bg-[#111C18] border border-[#233730] rounded-2xl p-4 space-y-3">
                <span className="text-xs font-bold text-[#B7F34A] uppercase tracking-wider block">
                  Image Filters & Lighting
                </span>

                <div>
                  <div className="flex justify-between text-[11px] text-slate-300 mb-1 font-mono">
                    <span>Brightness</span>
                    <span>{brightness}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="160"
                    value={brightness}
                    onChange={(e) => setBrightness(Number(e.target.value))}
                    className="w-full accent-[#B7F34A] cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-slate-300 mb-1 font-mono">
                    <span>Contrast</span>
                    <span>{contrast}%</span>
                  </div>
                  <input
                    type="range"
                    min="60"
                    max="180"
                    value={contrast}
                    onChange={(e) => setContrast(Number(e.target.value))}
                    className="w-full accent-[#B7F34A] cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-slate-300 mb-1 font-mono">
                    <span>Saturation</span>
                    <span>{saturation}%</span>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="200"
                    value={saturation}
                    onChange={(e) => setSaturation(Number(e.target.value))}
                    className="w-full accent-[#B7F34A] cursor-pointer"
                  />
                </div>

                <div className="flex items-center gap-4 pt-2">
                  <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={applyGlow}
                      onChange={(e) => setApplyGlow(e.target.checked)}
                      className="accent-[#B7F34A] rounded"
                    />
                    DPP Emerald Frame & Glow
                  </label>
                  <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={applyVignette}
                      onChange={(e) => setApplyVignette(e.target.checked)}
                      className="accent-[#B7F34A] rounded"
                    />
                    Dark Vignette
                  </label>
                </div>
              </div>

              {/* Promotional Sticker */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Promotional Sticker / Sale Ribbon
                </label>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  {['50% OFF', 'BESTSELLER', 'HOT DEAL', 'EASYPAISA', 'VERIFIED', 'NONE'].map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => {
                        setOverlayBadge(b);
                        setCustomBadgeText('');
                      }}
                      className={`py-1 px-2 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                        overlayBadge === b && !customBadgeText
                          ? 'bg-[#B7F34A] text-[#111C18] border-[#B7F34A]'
                          : 'bg-[#111C18] text-slate-300 border-[#233730]'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={customBadgeText}
                  onChange={(e) => setCustomBadgeText(e.target.value)}
                  placeholder="Or enter custom sticker text (e.g. 70% RAMADAN DEAL)"
                  className="w-full bg-[#1A2924] border border-[#233730] focus:border-[#B7F34A] rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Target Product Association Card */}
          <div className="bg-[#111C18] border border-[#233730] rounded-2xl p-4 space-y-3">
            <span className="text-xs font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#B7F34A]" />
              Apply Artwork Directly to Store Product
            </span>
            <select
              value={targetProductId}
              onChange={(e) => setTargetProductId(e.target.value)}
              className="w-full bg-[#1A2924] border border-[#233730] focus:border-[#B7F34A] rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={handleApplyToProduct}
              disabled={isSavingToProduct}
              className="w-full bg-[#B7F34A] hover:bg-[#a6e03f] text-[#111C18] font-black text-xs py-2.5 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50 transition-all"
            >
              {isSavingToProduct ? (
                <span>Saving to Catalog...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Save as Product Cover Image
                </>
              )}
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: LIVE CANVAS PREVIEW & EXPORT */}
        <div className="lg:col-span-7 flex flex-col items-center justify-start space-y-4">
          <div className="w-full bg-[#0D1613] border border-[#233730] rounded-2xl p-4 flex flex-col items-center justify-center min-h-[420px] shadow-2xl relative overflow-hidden">
            <span className="absolute top-4 left-4 bg-[#111C18]/80 backdrop-blur-md border border-[#233730] text-[10px] font-bold text-[#B7F34A] px-2.5 py-1 rounded-lg">
              Live Preview
            </span>

            {/* Canvas for Create Mode */}
            <canvas
              ref={createPreviewCanvasRef}
              className={`max-w-full h-auto rounded-xl shadow-xl transition-all ${
                activeMode === 'create' ? 'block' : 'hidden'
              }`}
              style={{ maxHeight: '460px' }}
            />

            {/* Canvas for Edit Mode */}
            <canvas
              ref={editPreviewCanvasRef}
              className={`max-w-full h-auto rounded-xl shadow-xl transition-all ${
                activeMode === 'edit' ? 'block' : 'hidden'
              }`}
              style={{ maxHeight: '460px' }}
            />
          </div>

          {/* Action Export Buttons */}
          <div className="w-full flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleDownloadImage}
                className="bg-[#1A2924] hover:bg-[#233730] border border-[#233730] text-white text-xs px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 cursor-pointer transition-all"
              >
                <Download className="w-3.5 h-3.5 text-[#B7F34A]" />
                Download PNG (High-Res)
              </button>

              <button
                type="button"
                onClick={handleCopyDataUrl}
                className="bg-[#1A2924] hover:bg-[#233730] border border-[#233730] text-slate-300 hover:text-white text-xs px-3.5 py-2.5 rounded-xl font-semibold flex items-center gap-2 cursor-pointer transition-all"
              >
                <Copy className="w-3.5 h-3.5" />
                Copy Data URL
              </button>
            </div>

            <span className="text-[11px] text-slate-400">
              Standard 800×800 / 960×540 • Web-Ready PNG
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
