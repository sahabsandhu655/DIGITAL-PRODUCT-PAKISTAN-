import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Download, 
  ExternalLink, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  MessageCircle, 
  ArrowLeft, 
  Copy, 
  Check, 
  FileText, 
  RefreshCw,
  ShieldCheck,
  AlertCircle,
  Key,
  FolderOpen
} from 'lucide-react';
import { Order, StoreSettings } from '../types';
import { getCustomerOrders, getOrderById } from '../services/storeService';

interface OrderHistoryPageProps {
  settings: StoreSettings;
  onBack: () => void;
  onExploreProducts: () => void;
}

export const OrderHistoryPage: React.FC<OrderHistoryPageProps> = ({
  settings,
  onBack,
  onExploreProducts,
}) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchNotFound, setSearchNotFound] = useState(false);
  const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);

  const loadPastOrders = async () => {
    setIsLoading(true);
    try {
      const list = await getCustomerOrders();
      setOrders(list);
    } catch (err) {
      console.warn('Error loading past orders:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPastOrders();
  }, []);

  const handleSearchOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setSearchNotFound(false);
    setSearchedOrder(null);

    try {
      // 1. Try single order by ID or orderNumber
      const order = await getOrderById(searchQuery.trim());
      if (order) {
        setSearchedOrder(order);
      } else {
        // 2. Try lookup by phone/email
        const matches = await getCustomerOrders(searchQuery.trim());
        if (matches && matches.length > 0) {
          setSearchedOrder(matches[0]);
        } else {
          setSearchNotFound(true);
        }
      }
    } catch (err) {
      console.error('Order search error:', err);
      setSearchNotFound(true);
    } finally {
      setIsSearching(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedOrderId(id);
    setTimeout(() => setCopiedOrderId(null), 2000);
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'Payment Confirmed':
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold px-2.5 py-1 rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Payment Confirmed</span>
          </span>
        );
      case 'Payment Proof Rejected':
        return (
          <span className="inline-flex items-center gap-1 bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold px-2.5 py-1 rounded-full">
            <XCircle className="w-3.5 h-3.5" />
            <span>Payment Proof Rejected</span>
          </span>
        );
      case 'Under Review':
        return (
          <span className="inline-flex items-center gap-1 bg-sky-500/20 text-sky-400 border border-sky-500/30 text-xs font-bold px-2.5 py-1 rounded-full">
            <Clock className="w-3.5 h-3.5" />
            <span>Under Review</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold px-2.5 py-1 rounded-full">
            <Clock className="w-3.5 h-3.5" />
            <span>Pending Verification</span>
          </span>
        );
    }
  };

  const getDeliveryStatusBadge = (status: string) => {
    switch (status) {
      case 'Delivered':
        return (
          <span className="inline-flex items-center gap-1 bg-[#B7F34A]/20 text-[#B7F34A] border border-[#B7F34A]/30 text-xs font-bold px-2.5 py-1 rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Delivered</span>
          </span>
        );
      case 'Ready for Delivery':
        return (
          <span className="inline-flex items-center gap-1 bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-bold px-2.5 py-1 rounded-full">
            <FolderOpen className="w-3.5 h-3.5" />
            <span>Ready for Delivery</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 bg-[#1A2924] text-slate-400 border border-[#233730] text-xs font-medium px-2.5 py-1 rounded-full">
            <Clock className="w-3.5 h-3.5" />
            <span>Awaiting Payment Check</span>
          </span>
        );
    }
  };

  // Helper to render an individual Order card
  const renderOrderCard = (order: Order) => {
    const isReadyOrDelivered = order.deliveryStatus === 'Delivered' || order.deliveryStatus === 'Ready for Delivery' || order.paymentStatus === 'Payment Confirmed';
    const whatsappClean = (settings.whatsappNumber || '+923107759274').replace(/[^0-9]/g, '');

    return (
      <div 
        key={order.id} 
        className="bg-[#15231F] border border-[#233730] hover:border-[#2e473e] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl transition-all"
      >
        {/* Order Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#233730]">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Order Reference:
              </span>
              <span className="font-extrabold text-white text-base tracking-wider">
                {order.orderNumber}
              </span>
              <button
                onClick={() => handleCopy(order.orderNumber, order.id)}
                className="p-1 text-slate-400 hover:text-white rounded hover:bg-[#1A2924] cursor-pointer"
                title="Copy Order ID"
              >
                {copiedOrderId === order.id ? (
                  <Check className="w-3.5 h-3.5 text-[#B7F34A]" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
            <span className="text-xs text-slate-400 block">
              Placed on {new Date(order.createdAt).toLocaleDateString('en-PK', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {getPaymentStatusBadge(order.paymentStatus)}
            {getDeliveryStatusBadge(order.deliveryStatus)}
          </div>
        </div>

        {/* Customer & Pricing Metadata */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-[#111C18] p-4 rounded-2xl text-xs">
          <div>
            <span className="text-slate-400 block">Customer Name</span>
            <span className="font-bold text-white mt-0.5 block truncate">{order.customerName}</span>
          </div>
          <div>
            <span className="text-slate-400 block">WhatsApp / Phone</span>
            <span className="font-bold text-[#B7F34A] mt-0.5 block truncate">{order.phone}</span>
          </div>
          <div>
            <span className="text-slate-400 block">Payment Method</span>
            <span className="font-bold text-white mt-0.5 block">Easypaisa</span>
          </div>
          <div>
            <span className="text-slate-400 block">Total Paid</span>
            <span className="font-extrabold text-[#B7F34A] text-sm mt-0.5 block">
              Rs. {order.totalPKR.toLocaleString()} PKR
            </span>
          </div>
        </div>

        {/* Purchased Items List */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">
            Purchased Digital Products ({order.items.length})
          </h4>
          <div className="space-y-3">
            {order.items.map((item, idx) => (
              <div 
                key={idx}
                className="bg-[#1A2924] border border-[#233730] rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <img
                    src={item.image || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=100&auto=format&fit=crop&q=80'}
                    alt={item.title}
                    className="w-14 h-14 rounded-lg object-cover bg-black shrink-0"
                  />
                  <div className="min-w-0">
                    <h5 className="font-bold text-white text-sm truncate">{item.title}</h5>
                    <span className="text-xs text-slate-400 block">
                      Quantity: {item.quantity} • {item.deliveryType || 'Instant Digital Delivery'}
                    </span>
                    <span className="text-xs font-bold text-[#B7F34A] mt-0.5 block">
                      Rs. {(item.pricePKR * item.quantity).toLocaleString()} PKR
                    </span>
                  </div>
                </div>

                {/* Direct Download button if delivered or ready */}
                {isReadyOrDelivered ? (
                  <div className="w-full sm:w-auto shrink-0">
                    <a
                      href={item.downloadUrl || 'https://drive.google.com'}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full sm:w-auto bg-[#B7F34A] hover:bg-[#A3E037] text-[#111C18] font-extrabold text-xs px-4 py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md shadow-[#B7F34A]/20"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Product</span>
                      <ExternalLink className="w-3 h-3 ml-0.5" />
                    </a>
                  </div>
                ) : (
                  <div className="text-xs text-slate-400 italic">
                    Downloads activate upon verification
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Download Links & Access Credentials Section */}
        {isReadyOrDelivered ? (
          <div className="bg-[#111C18] border-2 border-[#B7F34A]/30 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Download className="w-5 h-5 text-[#B7F34A]" />
              <h4 className="font-bold text-white text-sm">
                Active Digital Product Downloads & Credentials
              </h4>
            </div>

            {/* Delivery Instructions provided by admin */}
            {order.deliveryInstructions ? (
              <div className="bg-[#1A2924] border border-[#233730] p-4 rounded-xl space-y-2 text-xs">
                <div className="flex items-center gap-1.5 text-[#B7F34A] font-semibold">
                  <Key className="w-4 h-4" />
                  <span>Delivery Instructions & Setup Notes:</span>
                </div>
                <p className="text-slate-200 whitespace-pre-line leading-relaxed font-mono">
                  {order.deliveryInstructions}
                </p>
              </div>
            ) : (
              <p className="text-xs text-slate-300 leading-relaxed">
                Your payment has been verified. Download links and setup credentials for all items in your order are available via the download buttons above, and copies have also been dispatched to your WhatsApp.
              </p>
            )}

            {/* Additional custom links if attached */}
            {order.downloadLinks && order.downloadLinks.length > 0 && (
              <div className="space-y-2 pt-2">
                <span className="text-xs font-semibold text-slate-400 block">External Resource Vaults:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {order.downloadLinks.map((link, idx) => (
                    <a
                      key={idx}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-[#1A2924] hover:bg-[#233730] border border-[#233730] p-3 rounded-xl flex items-center justify-between text-xs text-white transition-colors"
                    >
                      <span className="font-semibold truncate">{link.title}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-[#B7F34A] shrink-0 ml-2" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Pending Verification Timeline */
          <div className="bg-[#111C18] border border-[#233730] rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
              <Clock className="w-4 h-4" />
              <span>Payment Verification Status Timeline</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px] text-slate-300">
              <div className="bg-[#1A2924] p-3 rounded-xl border border-[#233730]">
                <span className="text-[#B7F34A] font-bold block mb-1">1. Proof Submitted</span>
                <span>Your Easypaisa receipt screenshot is stored securely in our system.</span>
              </div>
              <div className="bg-[#1A2924] p-3 rounded-xl border border-amber-500/30">
                <span className="text-amber-300 font-bold block mb-1">2. Human Review</span>
                <span>Our team is verifying the TRX ID with our Easypaisa statement.</span>
              </div>
              <div className="bg-[#1A2924] p-3 rounded-xl border border-[#233730] opacity-60">
                <span className="text-slate-400 font-bold block mb-1">3. Downloads Unlocked</span>
                <span>Product download links and WhatsApp delivery activate once approved.</span>
              </div>
            </div>
          </div>
        )}

        {/* WhatsApp Help Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#B7F34A]" />
            <span>Need priority assistance with this order?</span>
          </span>
          <a
            href={`https://wa.me/${whatsappClean}?text=${encodeURIComponent(`Salam! Inquiring about my order ${order.orderNumber} (Rs. ${order.totalPKR}). Please check my verification status.`)}`}
            target="_blank"
            rel="noreferrer"
            className="text-[#B7F34A] hover:underline font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat on WhatsApp regarding {order.orderNumber}</span>
          </a>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-[#B7F34A] transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Store</span>
      </button>

      {/* Header */}
      <div className="border-b border-[#233730] pb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#B7F34A] uppercase tracking-wider mb-2">
            <ShoppingBag className="w-4 h-4" />
            <span>Customer Portal</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            Order History & Digital Downloads
          </h1>
          <p className="mt-2 text-sm text-slate-300 max-w-xl">
            Track your payment verification in real-time, view past orders, and download purchased e-books, course links, and software license instructions.
          </p>
        </div>

        <button
          onClick={loadPastOrders}
          disabled={isLoading}
          className="bg-[#1A2924] hover:bg-[#233730] text-slate-300 hover:text-white border border-[#233730] text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Orders</span>
        </button>
      </div>

      {/* Order Lookup Search Box */}
      <div className="bg-[#15231F] border border-[#233730] rounded-2xl p-6 space-y-4">
        <div>
          <h3 className="font-bold text-white text-base">Track Any Order</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Placed an order on another device? Enter your Order Number (e.g. <code>DPP-2026-XXXX</code>) or WhatsApp phone number to retrieve your purchase and download links.
          </p>
        </div>

        <form onSubmit={handleSearchOrder} className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter Order Number (DPP-2026-...) or WhatsApp number..."
              className="w-full bg-[#1A2924] border border-[#233730] focus:border-[#B7F34A] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={isSearching || !searchQuery.trim()}
            className="w-full sm:w-auto bg-[#B7F34A] hover:bg-[#A3E037] text-[#111C18] font-bold text-xs sm:text-sm px-6 py-2.5 rounded-xl transition-all cursor-pointer disabled:opacity-60 shrink-0"
          >
            {isSearching ? 'Searching...' : 'Find Order'}
          </button>
        </form>

        {searchNotFound && (
          <div className="bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs p-3 rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>No order found matching "{searchQuery}". Please verify your order reference number or contact support.</span>
          </div>
        )}
      </div>

      {/* Searched Order Result Showcase */}
      {searchedOrder && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#B7F34A] uppercase tracking-wider">
              Search Result
            </span>
            <button
              onClick={() => setSearchedOrder(null)}
              className="text-xs text-slate-400 hover:text-white cursor-pointer"
            >
              Clear Search Result
            </button>
          </div>
          {renderOrderCard(searchedOrder)}
        </div>
      )}

      {/* Recent Orders on this Device / Account */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white">
          Orders on This Device ({orders.length})
        </h2>

        {isLoading ? (
          <div className="p-12 text-center text-slate-400 space-y-3">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-[#B7F34A]" />
            <p className="text-sm">Fetching and syncing your orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-[#15231F] border border-[#233730] rounded-3xl p-12 text-center space-y-4 text-slate-400">
            <div className="w-16 h-16 rounded-full bg-[#1A2924] flex items-center justify-center mx-auto text-slate-500">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">No past orders found on this device</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                When you complete checkout and upload your Easypaisa screenshot, your orders and download links appear here.
              </p>
            </div>
            <button
              onClick={onExploreProducts}
              className="bg-[#B7F34A] text-[#111C18] font-extrabold text-xs px-6 py-3 rounded-xl hover:bg-[#A3E037] transition-all cursor-pointer shadow-md shadow-[#B7F34A]/20"
            >
              Explore Digital Products
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map(order => renderOrderCard(order))}
          </div>
        )}
      </div>
    </div>
  );
};
