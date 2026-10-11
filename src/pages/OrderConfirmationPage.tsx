import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Copy, 
  Check, 
  MessageCircle, 
  Clock, 
  ShoppingBag, 
  ArrowRight,
  ShieldCheck,
  Home
} from 'lucide-react';
import { Order, StoreSettings } from '../types';

interface OrderConfirmationPageProps {
  order: Order;
  settings: StoreSettings;
  onContinueShopping: () => void;
  onViewOrderHistory?: () => void;
}

export const OrderConfirmationPage: React.FC<OrderConfirmationPageProps> = ({
  order,
  settings,
  onContinueShopping,
  onViewOrderHistory,
}) => {
  const [copiedOrderNumber, setCopiedOrderNumber] = useState(false);

  const handleCopyOrderNumber = () => {
    navigator.clipboard.writeText(order.orderNumber);
    setCopiedOrderNumber(true);
    setTimeout(() => setCopiedOrderNumber(false), 2000);
  };

  const whatsappCleanNumber = (settings.whatsappNumber || '+923107759274').replace(/[^0-9]/g, '');

  const whatsappMessage = encodeURIComponent(
    `Hello Digital Product Pakistan! I have submitted my order.\n\n` +
    `Order Number: ${order.orderNumber}\n` +
    `Total Amount: Rs. ${order.totalPKR} PKR\n` +
    `Customer: ${order.customerName} (${order.phone})\n` +
    `Payment Status: Payment Proof Submitted (Pending Verification)\n\n` +
    `Please confirm receipt of my payment proof and let me know when my product credentials/download links will be delivered. Thank you!`
  );

  const whatsappUrl = `https://wa.me/${whatsappCleanNumber}?text=${whatsappMessage}`;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
      {/* Top Banner */}
      <div className="bg-[#15231F] border border-[#233730] rounded-3xl p-8 sm:p-10 text-center space-y-5 shadow-2xl">
        <div className="w-16 h-16 rounded-full bg-[#1A2924] border-2 border-[#B7F34A] text-[#B7F34A] flex items-center justify-center mx-auto shadow-lg shadow-[#B7F34A]/20">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Your order has been submitted successfully!
          </h1>
          <p className="mt-2 text-sm text-slate-300 max-w-lg mx-auto">
            Your payment proof is awaiting manual verification. We will deliver your product credentials and download links after confirming your payment.
          </p>
        </div>

        {/* Order Number Box */}
        <div className="inline-flex items-center gap-3 bg-[#111C18] border border-[#233730] px-5 py-3 rounded-2xl">
          <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
            Order Number:
          </span>
          <span className="text-base sm:text-lg font-extrabold text-[#B7F34A] tracking-wider">
            {order.orderNumber}
          </span>
          <button
            onClick={handleCopyOrderNumber}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#1A2924] transition-colors cursor-pointer"
            title="Copy Order Number"
          >
            {copiedOrderNumber ? (
              <Check className="w-4 h-4 text-[#B7F34A]" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Status Pill */}
        <div className="flex items-center justify-center gap-2 pt-2">
          <span className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold px-3 py-1 rounded-full">
            <Clock className="w-3.5 h-3.5" />
            <span>Status: Payment Proof Submitted (Pending Verification)</span>
          </span>
        </div>
      </div>

      {/* WhatsApp Handoff CTA */}
      <div className="bg-gradient-to-br from-[#1A2924] to-[#15231F] border-2 border-[#B7F34A]/40 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#25D366] text-[#111C18] flex items-center justify-center shrink-0 shadow-lg">
            <MessageCircle className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white">
              Send Order Details on WhatsApp (Optional)
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Accelerate your verification! Click below to send a prefilled confirmation message with your order number directly to our business WhatsApp. You can also re-attach your transaction receipt in the chat if required.
            </p>
          </div>
        </div>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="w-full bg-[#B7F34A] hover:bg-[#A3E037] text-[#111C18] font-extrabold text-sm py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#B7F34A]/20"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Send Order Details on WhatsApp</span>
        </a>
      </div>

      {/* Order Summary Snapshot */}
      <div className="bg-[#15231F] border border-[#233730] rounded-2xl p-6 space-y-4">
        <h3 className="font-bold text-white text-base border-b border-[#233730] pb-3">
          Order Summary Snapshot
        </h3>

        <div className="space-y-3">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between text-xs py-1">
              <div>
                <span className="font-semibold text-white block">{item.title}</span>
                <span className="text-slate-400">Qty: {item.quantity} • {item.deliveryType || 'Digital Delivery'}</span>
              </div>
              <span className="font-bold text-white">
                Rs. {(item.pricePKR * item.quantity).toLocaleString()} PKR
              </span>
            </div>
          ))}
        </div>

        <div className="border-t border-[#233730] pt-4 space-y-1.5 text-xs text-slate-300">
          <div className="flex justify-between">
            <span>Customer Name:</span>
            <span className="text-white font-medium">{order.customerName}</span>
          </div>
          <div className="flex justify-between">
            <span>WhatsApp / Phone:</span>
            <span className="text-white font-medium">{order.phone}</span>
          </div>
          {order.email && (
            <div className="flex justify-between">
              <span>Email:</span>
              <span className="text-white font-medium">{order.email}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Payment Method:</span>
            <span className="text-white font-medium">Easypaisa (Screenshot Uploaded)</span>
          </div>
          <div className="flex justify-between text-sm font-extrabold text-white pt-2 border-t border-[#233730]">
            <span>Amount Submitted:</span>
            <span className="text-[#B7F34A]">Rs. {order.totalPKR.toLocaleString()} PKR</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        {onViewOrderHistory && (
          <button
            onClick={onViewOrderHistory}
            className="w-full sm:w-auto bg-[#B7F34A] hover:bg-[#A3E037] text-[#111C18] font-extrabold text-xs sm:text-sm px-6 py-3.5 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md shadow-[#B7F34A]/20"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Track Order & View Downloads</span>
          </button>
        )}
        <button
          onClick={onContinueShopping}
          className="w-full sm:w-auto bg-[#1A2924] hover:bg-[#233730] text-white border border-[#233730] font-bold text-xs sm:text-sm px-6 py-3.5 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors"
        >
          <Home className="w-4 h-4 text-[#B7F34A]" />
          <span>Return to Homepage</span>
        </button>
      </div>
    </div>
  );
};
