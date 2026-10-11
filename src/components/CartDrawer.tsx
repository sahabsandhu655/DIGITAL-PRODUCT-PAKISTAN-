import React from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Plus, Minus, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CartDrawerProps {
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onCheckout }) => {
  const { 
    items, 
    isCartOpen, 
    setIsCartOpen, 
    removeFromCart, 
    updateQuantity, 
    totalPKR, 
    clearCart 
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#15231F] border-l border-[#233730] text-white flex flex-col shadow-2xl">
          {/* Header */}
          <div className="p-5 border-b border-[#233730] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#B7F34A]" />
              <h2 className="text-lg font-bold">Shopping Cart ({items.length})</h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-[#1A2924] transition-colors cursor-pointer"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items list */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4 text-slate-400">
                <div className="w-16 h-16 rounded-full bg-[#1A2924] flex items-center justify-center text-slate-500">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Your cart is empty</h3>
                  <p className="text-xs text-slate-400 mt-1">Explore our e-books, tools, and courses to add products.</p>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="bg-[#B7F34A] text-[#111C18] text-xs font-bold px-4 py-2 rounded-xl hover:bg-[#A3E037] transition-all cursor-pointer"
                >
                  Continue Browsing
                </button>
              </div>
            ) : (
              items.map(({ product, quantity }) => (
                <div 
                  key={product.id}
                  className="bg-[#1A2924] border border-[#233730] rounded-xl p-3.5 flex gap-3.5 items-center"
                >
                  <img
                    src={product.images[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=100&auto=format&fit=crop&q=80'}
                    alt={product.title}
                    className="w-16 h-16 rounded-lg object-cover bg-black shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-white truncate">{product.title}</h4>
                    <span className="text-xs text-slate-400 block">{product.category}</span>
                    <span className="text-xs font-bold text-[#B7F34A] mt-1 block">
                      Rs. {Math.round(product.pricePKR).toLocaleString()}
                    </span>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center bg-[#111C18] rounded-lg border border-[#233730]">
                        <button
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="p-1 hover:text-[#B7F34A] transition-colors cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold px-2">{quantity}</span>
                        <button
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          className="p-1 hover:text-[#B7F34A] transition-colors cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(product.id)}
                        className="text-slate-400 hover:text-red-400 text-xs p-1 transition-colors cursor-pointer ml-auto"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout */}
          {items.length > 0 && (
            <div className="p-5 border-t border-[#233730] bg-[#111C18] space-y-4">
              <div className="space-y-1.5 text-xs text-slate-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-white font-medium">Rs. {totalPKR.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Delivery</span>
                  <span className="text-[#B7F34A]">Instant via WhatsApp & Email</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-[#233730]">
                  <span>Total (PKR)</span>
                  <span className="text-base text-[#B7F34A]">Rs. {totalPKR.toLocaleString()}</span>
                </div>
              </div>

              <div className="bg-[#1A2924] border border-[#233730] p-2.5 rounded-xl flex items-center gap-2 text-[11px] text-slate-300">
                <ShieldCheck className="w-4 h-4 text-[#B7F34A] shrink-0" />
                <span>Guest checkout available. Pay with Easypaisa & upload proof.</span>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    onCheckout();
                  }}
                  className="w-full bg-[#B7F34A] hover:bg-[#A3E037] text-[#111C18] font-extrabold text-sm py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#B7F34A]/20 cursor-pointer active:scale-98"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="w-full text-slate-400 hover:text-white text-xs py-2 transition-colors cursor-pointer"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
