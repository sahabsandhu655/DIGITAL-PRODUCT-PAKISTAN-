import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Copy, 
  Check, 
  Upload, 
  X, 
  ShieldCheck, 
  AlertCircle, 
  FileText, 
  ArrowRight, 
  Smartphone,
  Lock,
  Loader2
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { StoreSettings, Order, OrderItemSnapshot } from '../types';
import { submitOrder } from '../services/storeService';

interface CheckoutPageProps {
  settings: StoreSettings;
  onOrderSuccess: (order: Order) => void;
  onBack: () => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  settings,
  onOrderSuccess,
  onBack,
}) => {
  const { items, totalPKR, subtotalPKR, discountPKR, clearCart } = useCart();

  // Form State
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('+92 ');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('Pakistan');
  const [customerNote, setCustomerNote] = useState('');

  // Screenshot Upload State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [base64Proof, setBase64Proof] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedNumber, setCopiedNumber] = useState(false);

  // International instructions toggle
  const [showInternational, setShowInternational] = useState(false);

  // Generate unique order reference
  const [orderNumber] = useState(() => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    return `DPP-2026-${randomSuffix}`;
  });

  // Copy Easypaisa Number
  const handleCopyNumber = () => {
    const num = settings.easypaisaNumber || '03010333544';
    navigator.clipboard.writeText(num);
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 2500);
  };

  // Handle File Upload & Validation
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type (JPG, PNG, WebP, PDF)
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      setUploadError('Invalid file format. Please upload JPG, PNG, WebP screenshot, or PDF receipt.');
      return;
    }

    // Validate size (max 5 MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setUploadError('File is too large. Maximum allowed size is 5 MB.');
      return;
    }

    setSelectedFile(file);

    // Generate local preview & base64
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setBase64Proof(result);
      if (file.type.startsWith('image/')) {
        setPreviewUrl(result);
      } else {
        setPreviewUrl(null);
      }
    };
    reader.onerror = () => {
      setUploadError('Failed to read file. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setBase64Proof(null);
    setUploadError(null);
  };

  // Handle Order Submission
  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadError(null);

    if (items.length === 0) {
      setUploadError('Your cart is empty. Please add items to proceed.');
      return;
    }

    if (!customerName.trim()) {
      setUploadError('Please enter your full name.');
      return;
    }

    if (!phone.trim() || phone.trim() === '+92') {
      setUploadError('Please enter your WhatsApp/phone number so we can deliver your product credentials.');
      return;
    }

    if (!base64Proof) {
      setUploadError('Please upload your Easypaisa payment transaction screenshot before submitting.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create price snapshots for each purchased item
      const itemSnapshots: OrderItemSnapshot[] = items.map(item => ({
        productId: item.product.id,
        title: item.product.title,
        pricePKR: Math.round(item.product.pricePKR),
        quantity: item.quantity,
        productType: item.product.productType,
        deliveryType: item.product.deliveryType,
        image: item.product.images[0],
      }));

      // Submit through serverService / API
      const newOrder = await submitOrder({
        orderNumber,
        customerName: customerName.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        country: country.trim() || 'Pakistan',
        items: itemSnapshots,
        subtotalPKR,
        discountPKR,
        totalPKR,
        currency: 'PKR',
        paymentMethod: 'Easypaisa',
        paymentProofPath: `payment-proofs/${orderNumber}/${selectedFile?.name || 'screenshot.png'}`,
        paymentProofUrl: base64Proof, // securely stored with admin-only access
        paymentStatus: 'Payment Proof Submitted',
        orderStatus: 'Pending Verification',
        deliveryStatus: 'Awaiting Payment',
        customerNote: customerNote.trim() || undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      // Clear shopping cart on success
      clearCart();

      // Trigger success confirmation view
      onOrderSuccess(newOrder);
    } catch (err: any) {
      console.error('Order creation error:', err);
      setUploadError(err.message || 'Failed to submit order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-[#B7F34A] transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Store</span>
      </button>

      <div className="border-b border-[#233730] pb-6">
        <h1 className="text-3xl font-extrabold text-white">
          Secure Guest Checkout
        </h1>
        <p className="mt-1 text-sm text-slate-300">
          No account registration required. Follow the Easypaisa instructions below, upload your transaction screenshot, and our team will verify and deliver your digital product.
        </p>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Customer Details & Easypaisa Payment Panel */}
        <div className="lg:col-span-7 space-y-8">
          {/* Section 1: Customer Contact Info */}
          <div className="bg-[#15231F] border border-[#233730] rounded-2xl p-6 space-y-5">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#B7F34A] text-[#111C18] text-xs font-black flex items-center justify-center">
                1
              </span>
              <span>Customer Delivery Information</span>
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Full Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Muhammad Ali"
                  className="w-full bg-[#1A2924] border border-[#233730] focus:border-[#B7F34A] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  WhatsApp / Phone Number (with country code) <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +92 300 1234567"
                  className="w-full bg-[#1A2924] border border-[#233730] focus:border-[#B7F34A] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Important: Credentials and download links are delivered directly to this WhatsApp number.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Email Address (Optional / Backup)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-[#1A2924] border border-[#233730] focus:border-[#B7F34A] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Country
                  </label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="Pakistan"
                    className="w-full bg-[#1A2924] border border-[#233730] focus:border-[#B7F34A] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Order Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  value={customerNote}
                  onChange={(e) => setCustomerNote(e.target.value)}
                  placeholder="Any specific delivery instructions or preferences..."
                  className="w-full bg-[#1A2924] border border-[#233730] focus:border-[#B7F34A] rounded-xl px-4 py-2 text-sm text-white focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Easypaisa Payment Instructions & Account Details */}
          <div className="bg-[#15231F] border-2 border-[#B7F34A]/30 rounded-2xl p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#B7F34A] text-[#111C18] text-xs font-black flex items-center justify-center">
                  2
                </span>
                <span>Easypaisa Payment Instructions</span>
              </h2>
              <span className="bg-[#111C18] text-[#B7F34A] text-xs font-bold px-2.5 py-1 rounded-md border border-[#233730]">
                Ref: {orderNumber}
              </span>
            </div>

            {/* Easypaisa Account Details Box */}
            <div className="bg-[#111C18] border border-[#233730] rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-[#233730] pb-3">
                <span className="text-xs text-slate-400">Payment Gateway</span>
                <span className="text-sm font-bold text-[#B7F34A] flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4" /> Easypaisa Mobile Account
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider block">
                    Account Holder Name
                  </span>
                  <span className="text-sm font-bold text-white mt-0.5 block">
                    {settings.easypaisaAccountName || 'MUHAMMAD KUMAIL ALI'}
                  </span>
                </div>

                <div>
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider block">
                    Easypaisa Account / Mobile Number
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-base font-extrabold text-[#B7F34A]">
                      {settings.easypaisaNumber || '03010333544'}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyNumber}
                      className="bg-[#1A2924] hover:bg-[#233730] text-slate-200 text-xs px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors cursor-pointer border border-[#233730]"
                    >
                      {copiedNumber ? (
                        <>
                          <Check className="w-3 h-3 text-[#B7F34A]" />
                          <span className="text-[#B7F34A]">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="border-t border-[#233730] pt-3 flex items-center justify-between">
                <span className="text-xs text-slate-400">Total Due</span>
                <span className="text-lg font-black text-white">
                  Rs. {totalPKR.toLocaleString()} PKR
                </span>
              </div>
            </div>

            {/* Clear Numbered Instructions */}
            <div className="space-y-2.5 text-xs text-slate-300">
              <h3 className="font-bold text-white text-sm">How to complete your payment:</h3>
              <ol className="space-y-2 list-decimal list-inside text-slate-300">
                <li>Send the exact total of <strong>Rs. {totalPKR.toLocaleString()} PKR</strong> to the Easypaisa number shown above.</li>
                <li>Take a clear screenshot of the completed transaction showing the <strong>TRX ID</strong>, amount, and date.</li>
                <li>Upload your screenshot using the file upload box below.</li>
                <li>Click <strong>"Submit Order for Verification"</strong>.</li>
                <li>Our team verifies the transaction and delivers your product via WhatsApp.</li>
              </ol>
            </div>

            {/* International Customers button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowInternational(!showInternational)}
                className="text-xs text-[#B7F34A] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Outside Pakistan or cannot use Easypaisa?</span>
              </button>
              {showInternational && (
                <div className="mt-3 bg-[#111C18] border border-[#233730] p-4 rounded-xl text-xs text-slate-300 space-y-2">
                  <span className="font-bold text-white block">International Payment Guidance:</span>
                  <p className="leading-relaxed text-slate-400">
                    {settings.internationalPaymentInstructions || 'Please message our customer support on WhatsApp (+923107759274) before submitting an order. We support international wire transfers and alternative payment channels upon manual verification.'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Section 3: Upload Payment Screenshot */}
          <div className="bg-[#15231F] border border-[#233730] rounded-2xl p-6 space-y-5">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#B7F34A] text-[#111C18] text-xs font-black flex items-center justify-center">
                3
              </span>
              <span>Upload Payment Screenshot (Proof)</span>
            </h2>

            {uploadError && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-300 text-xs p-3 rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            {!selectedFile ? (
              <div className="border-2 border-dashed border-[#233730] hover:border-[#B7F34A] rounded-2xl p-8 text-center transition-colors">
                <input
                  type="file"
                  id="screenshot-upload"
                  accept="image/jpeg,image/png,image/webp,application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="screenshot-upload"
                  className="cursor-pointer flex flex-col items-center justify-center space-y-3"
                >
                  <div className="w-14 h-14 rounded-2xl bg-[#1A2924] text-[#B7F34A] flex items-center justify-center shadow-md">
                    <Upload className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-white block">
                      Click to upload Easypaisa screenshot
                    </span>
                    <span className="text-xs text-slate-400 mt-1 block">
                      Supported: JPG, PNG, WebP or PDF (Max 5 MB)
                    </span>
                  </div>
                  <span className="bg-[#1A2924] border border-[#233730] text-slate-300 hover:text-white text-xs font-semibold px-4 py-2 rounded-xl">
                    Select File
                  </span>
                </label>
              </div>
            ) : (
              <div className="bg-[#1A2924] border border-[#233730] rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 truncate">
                    <FileText className="w-5 h-5 text-[#B7F34A] shrink-0" />
                    <div className="truncate">
                      <span className="text-xs font-bold text-white block truncate">
                        {selectedFile.name}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {(selectedFile.size / 1024).toFixed(1)} KB • Verified Image
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="p-1 text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                    title="Remove file"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Preview Thumbnail */}
                {previewUrl && (
                  <div className="mt-2 rounded-lg overflow-hidden border border-[#233730] max-h-48 bg-black flex justify-center">
                    <img
                      src={previewUrl}
                      alt="Payment proof preview"
                      className="max-h-48 object-contain"
                    />
                  </div>
                )}

                <div className="flex items-center gap-2 text-[11px] text-[#B7F34A] pt-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>Payment proof attached and ready for verification</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Order Summary & Submission Button */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#15231F] border border-[#233730] rounded-2xl p-6 space-y-6 sticky top-24">
            <h2 className="text-lg font-bold text-white pb-3 border-b border-[#233730]">
              Order Summary ({items.length} items)
            </h2>

            {/* Item list */}
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex items-center gap-3 text-xs">
                  <img
                    src={product.images[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=60&auto=format&fit=crop&q=80'}
                    alt={product.title}
                    className="w-12 h-12 rounded-lg object-cover bg-black shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="font-bold text-white block truncate">{product.title}</span>
                    <span className="text-slate-400">Qty: {quantity} • {product.category}</span>
                  </div>
                  <span className="font-bold text-white shrink-0">
                    Rs. {(Math.round(product.pricePKR) * quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="space-y-2 pt-4 border-t border-[#233730] text-xs text-slate-300">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-white font-medium">Rs. {subtotalPKR.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Discount</span>
                <span className="text-[#B7F34A]">Rs. {discountPKR.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Verification Fee</span>
                <span className="text-white">Rs. 0 (Free)</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-white pt-2 border-t border-[#233730]">
                <span>Total Amount Payable</span>
                <span className="text-[#B7F34A] text-lg">Rs. {totalPKR.toLocaleString()} PKR</span>
              </div>
            </div>

            {/* Security Guarantee Box */}
            <div className="bg-[#111C18] border border-[#233730] p-4 rounded-xl space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2 text-[#B7F34A] font-bold">
                <Lock className="w-4 h-4" />
                <span>Verification & Delivery Guarantee</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Payment is verified manually. Your digital product will be delivered after your payment has been confirmed. Proof images are kept private and never exposed to the public.
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#B7F34A] hover:bg-[#A3E037] text-[#111C18] font-extrabold text-base py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-xl shadow-[#B7F34A]/20 cursor-pointer active:scale-98 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Submitting Order...</span>
                </>
              ) : (
                <>
                  <span>Submit Order for Verification</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            <span className="text-[11px] text-center text-slate-400 block">
              By submitting, you agree to Digital Product Pakistan's Delivery & Refund Policies.
            </span>
          </div>
        </div>
      </form>
    </div>
  );
};
