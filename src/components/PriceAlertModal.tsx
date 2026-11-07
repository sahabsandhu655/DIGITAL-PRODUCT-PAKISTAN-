import React, { useState } from 'react';
import { Bell, Check, X, Shield, ArrowDownRight, Sparkles, Loader2 } from 'lucide-react';
import { Product } from '../types';
import { savePriceAlert } from '../services/storeService';

interface PriceAlertModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export const PriceAlertModal: React.FC<PriceAlertModalProps> = ({
  product,
  isOpen,
  onClose,
}) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);

    try {
      await savePriceAlert({
        productId: product.id,
        productTitle: product.title,
        currentPricePKR: product.pricePKR,
        email: cleanEmail,
      });

      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setEmail('');
        onClose();
      }, 2500);
    } catch (err: any) {
      setErrorMessage(err.message || 'Could not save alert. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-[#111C18] border border-[#233730] rounded-2xl shadow-2xl overflow-hidden p-6 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-[#1A2924] transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="text-center py-6 space-y-3">
            <div className="w-14 h-14 mx-auto rounded-full bg-[#B7F34A]/10 border border-[#B7F34A]/30 flex items-center justify-center text-[#B7F34A]">
              <Check className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white">Price Alert Set!</h3>
            <p className="text-sm text-slate-300 max-w-xs mx-auto">
              We will send an instant email notification to <span className="text-[#B7F34A] font-medium">{email}</span> as soon as the price for <span className="font-semibold text-white">{product.title}</span> drops below Rs. {Math.round(product.pricePKR).toLocaleString()} PKR.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#B7F34A]/10 border border-[#B7F34A]/30 flex items-center justify-center text-[#B7F34A] shrink-0">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-semibold tracking-wider text-[#B7F34A] uppercase flex items-center gap-1">
                  <ArrowDownRight className="w-3.5 h-3.5" />
                  Price Drop Notification
                </span>
                <h3 className="text-base font-bold text-white">Notify Me on Price Drop</h3>
              </div>
            </div>

            {/* Product summary banner */}
            <div className="bg-[#15231F] border border-[#233730] rounded-xl p-3 flex items-center gap-3">
              <img
                src={product.images[0] || '/assets/products/gemini-pro.svg'}
                alt={product.title}
                className="w-12 h-12 rounded-lg object-contain bg-[#0E1714] p-1 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-white truncate">{product.title}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-slate-400">Current Price:</span>
                  <span className="text-xs font-extrabold text-[#B7F34A]">
                    Rs. {Math.round(product.pricePKR).toLocaleString()} PKR
                  </span>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Don't miss limited-time flash discounts or seasonal promotions in Pakistan. Enter your email and we'll alert you the moment this item goes on sale.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3 pt-1">
              <div>
                <label htmlFor="alert-email" className="block text-xs font-medium text-slate-300 mb-1.5">
                  Your Email Address
                </label>
                <input
                  id="alert-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@gmail.com"
                  required
                  autoFocus
                  className="w-full bg-[#15231F] border border-[#233730] focus:border-[#B7F34A] focus:ring-1 focus:ring-[#B7F34A] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-all"
                />
              </div>

              {errorMessage && (
                <p className="text-xs text-rose-400">{errorMessage}</p>
              )}

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-1/3 py-2.5 px-3 rounded-xl border border-[#233730] text-slate-300 hover:text-white hover:bg-[#1A2924] font-medium text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-2/3 py-2.5 px-4 rounded-xl bg-[#B7F34A] hover:bg-[#a3e038] text-[#111C18] font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 disabled:opacity-50 cursor-pointer shadow-lg shadow-[#B7F34A]/10"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Bell className="w-3.5 h-3.5 fill-[#111C18]" />
                      <span>Notify Me When Price Drops</span>
                    </>
                  )}
                </button>
              </div>

              <div className="pt-2 flex items-center justify-center gap-1.5 text-[11px] text-slate-400 text-center">
                <Shield className="w-3 h-3 text-[#B7F34A]" />
                <span>Zero spam. Only notified when the price drops.</span>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
