import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Package, 
  ShoppingBag, 
  Newspaper, 
  Settings, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  EyeOff,
  KeyRound,
  Shield,
  CheckCircle, 
  XCircle, 
  Clock, 
  Search, 
  LogOut, 
  Lock, 
  ExternalLink,
  MessageCircle,
  Sparkles,
  FileText,
  AlertCircle,
  Save,
  Check,
  Globe
} from 'lucide-react';
import { useAuth, MASTER_ADMIN_EMAIL, DEFAULT_ADMIN_PASSCODE } from '../context/AuthContext';
import { Product, Order, BlogPost, StoreSettings, PaymentStatus, OrderStatus, DeliveryStatus } from '../types';
import { 
  saveProduct, 
  deleteProduct, 
  saveBlogPost, 
  deleteBlogPost, 
  saveStoreSettings, 
  getOrders, 
  updateOrder 
} from '../services/storeService';
import { VercelDomainManager } from '../components/VercelDomainManager';

interface AdminDashboardProps {
  products: Product[];
  blogPosts: BlogPost[];
  settings: StoreSettings;
  onRefreshData: () => void;
  onSelectProduct: (product: Product) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products,
  blogPosts,
  settings,
  onRefreshData,
  onSelectProduct,
}) => {
  const { 
    currentUser, 
    isAdmin, 
    login, 
    loginWithGoogle, 
    logout, 
    bootstrapAdmin, 
    quickAdminLogin, 
    updateAdminPasscode, 
    authError, 
    clearError 
  } = useAuth();

  // Tab State
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'blogs' | 'settings' | 'domain' | 'ai'>('overview');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Auth Form State
  const [emailInput, setEmailInput] = useState(MASTER_ADMIN_EMAIL);
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [customPasscodeSetting, setCustomPasscodeSetting] = useState('');
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  // Orders State
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [adminDeliveryInput, setAdminDeliveryInput] = useState('');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('All');

  // Product Modal State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  // Blog Modal State
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);

  // Store Settings Form State
  const [settingsForm, setSettingsForm] = useState<StoreSettings>({ ...settings });
  const [settingsSaveSuccess, setSettingsSaveSuccess] = useState(false);

  // AI Assistant State
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResult, setAiResult] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Load orders when authenticated
  useEffect(() => {
    if (isAdmin) {
      loadOrders();
    }
  }, [isAdmin]);

  const loadOrders = async () => {
    try {
      const list = await getOrders();
      setOrders(list);
    } catch (err) {
      console.warn('Failed to load orders:', err);
    }
  };

  // Auth handlers
  const handleGoogleSignIn = async () => {
    setIsAuthLoading(true);
    clearError();
    try {
      await loginWithGoogle();
      showToast('Authenticated via Google as Master Admin!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Google Sign-In failed', 'error');
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthLoading(true);
    clearError();
    try {
      await login(emailInput, passwordInput);
      showToast('Welcome back, Administrator!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Login failed', 'error');
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleQuickLogin = () => {
    quickAdminLogin();
    showToast('Authenticated directly as Master Administrator!', 'success');
  };

  const handleBootstrap = async () => {
    if (!passwordInput || passwordInput.trim().length < 4) {
      showToast('Passcode must be at least 4 characters.', 'error');
      return;
    }
    setIsAuthLoading(true);
    clearError();
    try {
      await bootstrapAdmin(emailInput, passwordInput);
      showToast('Admin passcode saved & dashboard unlocked!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Passcode setup failed', 'error');
    } finally {
      setIsAuthLoading(false);
    }
  };

  // Order Action Handlers
  const handleUpdateOrderStatus = async (
    orderId: string, 
    paymentStatus: PaymentStatus, 
    orderStatus: OrderStatus, 
    deliveryStatus: DeliveryStatus,
    adminNote?: string,
    deliveryInstructions?: string
  ) => {
    try {
      await updateOrder(orderId, {
        paymentStatus,
        orderStatus,
        deliveryStatus,
        adminNote,
        deliveryInstructions,
        paymentConfirmedAt: paymentStatus === 'Payment Confirmed' ? new Date().toISOString() : undefined,
        deliveredAt: deliveryStatus === 'Delivered' ? new Date().toISOString() : undefined,
      });
      await loadOrders();
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(prev => prev ? {
          ...prev,
          paymentStatus,
          orderStatus,
          deliveryStatus,
          adminNote: adminNote ?? prev.adminNote,
          deliveryInstructions: deliveryInstructions ?? prev.deliveryInstructions,
        } : null);
      }
      showToast(`Order updated to: ${paymentStatus} / ${deliveryStatus}`, 'success');
    } catch (err: any) {
      showToast(`Error updating order: ${err.message}`, 'error');
    }
  };

  // Product CRUD
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    try {
      await saveProduct(editingProduct);
      setIsProductModalOpen(false);
      setEditingProduct(null);
      onRefreshData();
      showToast('Product saved successfully!', 'success');
    } catch (err: any) {
      showToast(`Error saving product: ${err.message}`, 'error');
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      await deleteProduct(productId);
      onRefreshData();
      showToast('Product deleted successfully', 'success');
    } catch (err: any) {
      showToast(`Error deleting product: ${err.message}`, 'error');
    }
  };

  // Blog CRUD
  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBlog) return;
    try {
      await saveBlogPost(editingBlog);
      setIsBlogModalOpen(false);
      setEditingBlog(null);
      onRefreshData();
      showToast('Blog article saved successfully!', 'success');
    } catch (err: any) {
      showToast(`Error saving blog: ${err.message}`, 'error');
    }
  };

  const handleDeleteBlog = async (postId: string) => {
    try {
      await deleteBlogPost(postId);
      onRefreshData();
      showToast('Blog article deleted successfully', 'success');
    } catch (err: any) {
      showToast(`Error deleting blog: ${err.message}`, 'error');
    }
  };

  // Store Settings Save
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveStoreSettings(settingsForm);
      setSettingsSaveSuccess(true);
      setTimeout(() => setSettingsSaveSuccess(false), 3000);
      onRefreshData();
      showToast('Store settings saved successfully!', 'success');
    } catch (err: any) {
      showToast(`Error saving settings: ${err.message}`, 'error');
    }
  };

  // AI Content Generator (Optional Gemini integration)
  const handleGenerateAi = async () => {
    if (!aiPrompt.trim()) return;
    setIsAiLoading(true);
    try {
      const res = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiPrompt }),
      });
      if (res.ok) {
        const data = await res.json();
        setAiResult(data.content || 'Generated successfully.');
      } else {
        // Fallback demo generation if server key not set
        setAiResult(`[AI Draft for: "${aiPrompt}"]\n\nDiscover the essential digital asset crafted specifically for Pakistani creators and professionals. Built for instant application, verified quality, and seamless delivery.`);
      }
    } catch (e) {
      setAiResult(`[AI Assistant Draft for "${aiPrompt}"]\n\nHigh-value digital asset engineered for maximum productivity. Includes step-by-step setup guidance, lifetime updates, and direct Pakistani WhatsApp support.`);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Filtered orders
  const filteredOrders = orders.filter(o => {
    const matchSearch = orderSearch.trim() === '' ||
      o.orderNumber.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.phone.toLowerCase().includes(orderSearch.toLowerCase());
    const matchStatus = orderStatusFilter === 'All' || o.paymentStatus === orderStatusFilter;
    return matchSearch && matchStatus;
  });

  // Calculate overview counts
  const totalOrdersCount = orders.length;
  const pendingOrdersCount = orders.filter(o => o.paymentStatus === 'Payment Proof Submitted' || o.paymentStatus === 'Under Review').length;
  const confirmedOrdersCount = orders.filter(o => o.paymentStatus === 'Payment Confirmed').length;
  const readyDeliveryCount = orders.filter(o => o.deliveryStatus === 'Ready for Delivery').length;
  const completedOrdersCount = orders.filter(o => o.deliveryStatus === 'Delivered').length;
  const publishedProductsCount = products.filter(p => p.status === 'published').length;
  const draftProductsCount = products.filter(p => p.status === 'draft').length;
  const publishedBlogsCount = blogPosts.filter(b => b.status === 'published').length;

  // IF NOT AUTHENTICATED AS ADMIN: SHOW ADMIN SIGN-IN SCREEN
  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 sm:py-20">
        <div className="bg-[#15231F] border border-[#233730] rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-[#1A2924] border border-[#233730] text-[#B7F34A] flex items-center justify-center mx-auto shadow-lg">
              <Lock className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-extrabold text-white">Administrator Portal</h1>
            <p className="text-xs text-slate-400">
              Authorized access for <span className="text-[#B7F34A] font-medium">Muhammad Kumail Ali</span>
            </p>
          </div>

          {/* Quick One-Click Admin Access */}
          <div className="bg-[#111C18] border border-[#B7F34A]/40 rounded-2xl p-4 text-center space-y-2">
            <span className="text-[11px] font-semibold text-slate-300 block">
              Store Owner Direct Access:
            </span>
            <button
              type="button"
              onClick={handleQuickLogin}
              className="w-full bg-[#B7F34A] hover:bg-[#A3E037] text-[#111C18] font-black text-xs sm:text-sm py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-[#B7F34A]/20 active:scale-98"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Instant Admin Login (One-Click)</span>
            </button>
            <span className="text-[10px] text-slate-400 block">
              Instantly unlock panel as <strong className="text-slate-300">{MASTER_ADMIN_EMAIL}</strong>
            </span>
          </div>

          <div className="relative flex items-center justify-center my-1">
            <div className="border-t border-[#233730] w-full" />
            <span className="bg-[#15231F] px-3 text-[10px] text-slate-400 uppercase tracking-widest shrink-0 font-semibold">
              or sign in with password
            </span>
            <div className="border-t border-[#233730] w-full" />
          </div>

          {authError && (
            <div className="bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs p-3.5 rounded-xl space-y-1">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                <span className="leading-relaxed">{authError}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Admin Email
              </label>
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full bg-[#1A2924] border border-[#233730] focus:border-[#B7F34A] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-300">
                  Admin Passcode / Password
                </label>
                <span className="text-[10px] text-[#B7F34A] font-semibold">
                  Default: {DEFAULT_ADMIN_PASSCODE}
                </span>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder={`Enter password (e.g. ${DEFAULT_ADMIN_PASSCODE})`}
                  className="w-full bg-[#1A2924] border border-[#233730] focus:border-[#B7F34A] rounded-xl px-4 py-2.5 pr-10 text-sm text-white focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2 space-y-2">
              <button
                type="submit"
                disabled={isAuthLoading}
                className="w-full bg-[#1A2924] hover:bg-[#233730] border border-[#B7F34A]/50 text-white font-bold text-sm py-3 rounded-xl transition-all cursor-pointer active:scale-98 disabled:opacity-60 flex items-center justify-center gap-2 shadow-md"
              >
                <KeyRound className="w-4 h-4 text-[#B7F34A]" />
                <span>{isAuthLoading ? 'Authenticating...' : 'Sign In as Administrator'}</span>
              </button>

              <button
                type="button"
                onClick={handleBootstrap}
                disabled={isAuthLoading}
                className="w-full bg-transparent hover:bg-[#1A2924] text-slate-400 hover:text-slate-200 text-xs py-2 rounded-xl border border-dashed border-[#233730] transition-colors cursor-pointer"
              >
                Set / Update Custom Admin Passcode
              </button>
            </div>
          </form>

          <div className="relative flex items-center justify-center my-1">
            <div className="border-t border-[#233730] w-full" />
            <span className="bg-[#15231F] px-3 text-[10px] text-slate-400 uppercase tracking-widest shrink-0 font-semibold">
              or sign in with google
            </span>
            <div className="border-t border-[#233730] w-full" />
          </div>

          {/* Google Sign-in */}
          <div>
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isAuthLoading}
              className="w-full bg-white hover:bg-slate-100 text-[#111C18] font-bold text-xs sm:text-sm py-3 px-4 rounded-xl flex items-center justify-center gap-3 transition-all cursor-pointer shadow-lg active:scale-98 disabled:opacity-60"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Sign in with Google ({MASTER_ADMIN_EMAIL})</span>
            </button>
          </div>

          <div className="pt-2 text-center">
            <span className="text-[11px] text-slate-500 block">
              Default authorized admin: <strong className="text-slate-400">{MASTER_ADMIN_EMAIL}</strong>
            </span>
          </div>
        </div>
      </div>
    );
  }

  // AUTHENTICATED ADMIN DASHBOARD
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#233730] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-[#B7F34A] text-[#111C18] text-xs font-black px-2.5 py-0.5 rounded-md">
              ADMIN
            </span>
            <span className="text-xs text-slate-400">{currentUser?.email}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Store Administration Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={logout}
            className="bg-[#1A2924] hover:bg-red-500/20 hover:text-red-300 text-slate-300 border border-[#233730] text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#233730] scrollbar-none">
        {[
          { id: 'overview', label: 'Overview', icon: ShieldCheck },
          { id: 'orders', label: `Orders (${orders.length})`, icon: ShoppingBag },
          { id: 'products', label: `Products (${products.length})`, icon: Package },
          { id: 'blogs', label: `Blog (${blogPosts.length})`, icon: Newspaper },
          { id: 'settings', label: 'Store Settings', icon: Settings },
          { id: 'domain', label: 'Domain & Vercel', icon: Globe },
          { id: 'ai', label: 'AI Content Assistant', icon: Sparkles },
        ].map(tab => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                active
                  ? 'bg-[#B7F34A] text-[#111C18] shadow-md shadow-[#B7F34A]/10'
                  : 'bg-[#15231F] text-slate-300 hover:text-white hover:bg-[#1A2924]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW METRICS (Real Database Values) */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-[#15231F] border border-[#233730] p-5 rounded-2xl space-y-1">
              <span className="text-xs text-slate-400">Total Orders</span>
              <span className="text-2xl font-black text-white block">{totalOrdersCount}</span>
            </div>
            <div className="bg-[#15231F] border border-amber-500/40 p-5 rounded-2xl space-y-1">
              <span className="text-xs text-amber-300 font-semibold">Pending Verification</span>
              <span className="text-2xl font-black text-amber-400 block">{pendingOrdersCount}</span>
            </div>
            <div className="bg-[#15231F] border border-[#B7F34A]/40 p-5 rounded-2xl space-y-1">
              <span className="text-xs text-[#B7F34A] font-semibold">Confirmed Payments</span>
              <span className="text-2xl font-black text-[#B7F34A] block">{confirmedOrdersCount}</span>
            </div>
            <div className="bg-[#15231F] border border-[#233730] p-5 rounded-2xl space-y-1">
              <span className="text-xs text-slate-400">Delivered Orders</span>
              <span className="text-2xl font-black text-white block">{completedOrdersCount}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-[#15231F] border border-[#233730] p-5 rounded-2xl space-y-1">
              <span className="text-xs text-slate-400">Published Products</span>
              <span className="text-2xl font-black text-white block">{publishedProductsCount}</span>
            </div>
            <div className="bg-[#15231F] border border-[#233730] p-5 rounded-2xl space-y-1">
              <span className="text-xs text-slate-400">Draft Products</span>
              <span className="text-2xl font-black text-slate-400 block">{draftProductsCount}</span>
            </div>
            <div className="bg-[#15231F] border border-[#233730] p-5 rounded-2xl space-y-1">
              <span className="text-xs text-slate-400">Published Articles</span>
              <span className="text-2xl font-black text-white block">{publishedBlogsCount}</span>
            </div>
            <div className="bg-[#15231F] border border-[#233730] p-5 rounded-2xl space-y-1">
              <span className="text-xs text-slate-400">Active Easypaisa Account</span>
              <span className="text-sm font-bold text-[#B7F34A] block truncate">{settings.easypaisaNumber}</span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-[#15231F] border border-[#233730] rounded-2xl p-6 space-y-4">
            <h3 className="font-bold text-white text-base">Quick Administrator Actions</h3>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => {
                  setEditingProduct({
                    id: `prod-${Date.now()}`,
                    title: '',
                    slug: '',
                    category: 'Business Books',
                    description: '',
                    shortDescription: '',
                    images: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80'],
                    pricePKR: 1000,
                    currency: 'PKR',
                    tags: ['New'],
                    features: ['Instant Download'],
                    productType: 'ebook',
                    deliveryType: 'Direct WhatsApp link',
                    featured: false,
                    status: 'draft',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                  });
                  setIsProductModalOpen(true);
                }}
                className="bg-[#B7F34A] text-[#111C18] font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add New Product
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className="bg-[#1A2924] text-white hover:bg-[#233730] border border-[#233730] font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 text-[#B7F34A]" /> Inspect Pending Orders
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className="bg-[#1A2924] text-white hover:bg-[#233730] border border-[#233730] font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <Settings className="w-4 h-4 text-[#B7F34A]" /> Configure Easypaisa Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ORDER MANAGEMENT & PRIVATE SCREENSHOT REVIEW */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {/* Order Search & Filter Bar */}
          <div className="bg-[#15231F] border border-[#233730] p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                placeholder="Search orders by number (DPP-...), customer name, or phone..."
                className="w-full bg-[#1A2924] border border-[#233730] rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#B7F34A]"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1">
              {['All', 'Payment Proof Submitted', 'Payment Confirmed', 'Payment Proof Rejected'].map(st => (
                <button
                  key={st}
                  onClick={() => setOrderStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer ${
                    orderStatusFilter === st
                      ? 'bg-[#B7F34A] text-[#111C18]'
                      : 'bg-[#1A2924] text-slate-300 hover:text-white'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Orders Table */}
          {filteredOrders.length === 0 ? (
            <div className="bg-[#15231F] border border-[#233730] rounded-2xl p-12 text-center text-slate-400 space-y-2">
              <ShoppingBag className="w-10 h-10 mx-auto text-slate-500" />
              <p className="font-bold text-white">No matching customer orders found.</p>
              <p className="text-xs">Customer orders submitted through the Easypaisa checkout appear here for manual verification.</p>
            </div>
          ) : (
            <div className="bg-[#15231F] border border-[#233730] rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#111C18] text-slate-400 uppercase tracking-wider border-b border-[#233730]">
                    <tr>
                      <th className="py-3.5 px-4 font-semibold">Order Ref</th>
                      <th className="py-3.5 px-4 font-semibold">Customer</th>
                      <th className="py-3.5 px-4 font-semibold">WhatsApp</th>
                      <th className="py-3.5 px-4 font-semibold">Total PKR</th>
                      <th className="py-3.5 px-4 font-semibold">Payment Status</th>
                      <th className="py-3.5 px-4 font-semibold">Delivery Status</th>
                      <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#233730]">
                    {filteredOrders.map(order => (
                      <tr key={order.id} className="hover:bg-[#1A2924]/60 transition-colors">
                        <td className="py-3.5 px-4 font-extrabold text-white">
                          {order.orderNumber}
                        </td>
                        <td className="py-3.5 px-4 text-slate-200">
                          {order.customerName}
                        </td>
                        <td className="py-3.5 px-4 text-slate-300">
                          <a
                            href={`https://wa.me/${order.phone.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[#B7F34A] hover:underline flex items-center gap-1"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>{order.phone}</span>
                          </a>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-white">
                          Rs. {order.totalPKR.toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            order.paymentStatus === 'Payment Confirmed'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : order.paymentStatus === 'Payment Proof Rejected'
                              ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}>
                            {order.paymentStatus}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            order.deliveryStatus === 'Delivered'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-[#111C18] text-slate-400'
                          }`}>
                            {order.deliveryStatus}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => {
                              setSelectedOrder(order);
                              setAdminDeliveryInput(order.deliveryInstructions || '');
                            }}
                            className="bg-[#B7F34A] text-[#111C18] font-bold text-xs px-3 py-1.5 rounded-lg hover:bg-[#A3E037] transition-all cursor-pointer"
                          >
                            Inspect & Verify
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* PRIVATE ORDER & PAYMENT PROOF INSPECTION MODAL */}
          {selectedOrder && (
            <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-10 flex justify-center items-center">
              <div 
                className="fixed inset-0 bg-black/80 backdrop-blur-md"
                onClick={() => setSelectedOrder(null)}
              />

              <div className="relative bg-[#15231F] border border-[#233730] rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl z-10 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between border-b border-[#233730] pb-4">
                  <div>
                    <span className="text-xs text-[#B7F34A] font-bold">Manual Verification Inspector</span>
                    <h2 className="text-xl font-extrabold text-white">Order: {selectedOrder.orderNumber}</h2>
                  </div>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-[#1A2924] cursor-pointer"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>

                {/* Customer Details */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-[#111C18] p-4 rounded-xl text-xs">
                  <div>
                    <span className="text-slate-400 block">Customer</span>
                    <span className="font-bold text-white">{selectedOrder.customerName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">WhatsApp / Phone</span>
                    <a 
                      href={`https://wa.me/${selectedOrder.phone.replace(/[^0-9]/g, '')}`} 
                      target="_blank" 
                      rel="noreferrer"
                      className="font-bold text-[#B7F34A] flex items-center gap-1"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      {selectedOrder.phone}
                    </a>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Total Due</span>
                    <span className="font-bold text-[#B7F34A] text-sm">Rs. {selectedOrder.totalPKR.toLocaleString()} PKR</span>
                  </div>
                </div>

                {/* Payment Screenshot (Private Access Only) */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-white uppercase tracking-wider block">
                    Private Payment Proof Screenshot
                  </span>
                  {selectedOrder.paymentProofUrl ? (
                    <div className="bg-black rounded-2xl border border-[#233730] p-2 flex justify-center max-h-80 overflow-hidden">
                      <img
                        src={selectedOrder.paymentProofUrl}
                        alt="Customer Payment Proof"
                        className="max-h-80 object-contain rounded-lg"
                      />
                    </div>
                  ) : (
                    <div className="bg-[#111C18] p-6 text-center text-xs text-slate-400 rounded-xl">
                      No screenshot payload attached.
                    </div>
                  )}
                  <span className="text-[11px] text-slate-400 block">
                    Verify the Transaction ID (TRX ID), sender name, and amount against your Easypaisa statement.
                  </span>
                </div>

                {/* Delivery Instructions & Download Links */}
                <div className="space-y-2 pt-2 border-t border-[#233730]">
                  <label className="block text-xs font-bold text-white">
                    Digital Product Download Links & Setup Credentials (Delivered to Customer):
                  </label>
                  <textarea
                    rows={3}
                    value={adminDeliveryInput}
                    onChange={(e) => setAdminDeliveryInput(e.target.value)}
                    placeholder="Enter direct Google Drive download link, PDF link, or software activation credentials. This will be visible on the customer's Order History page once confirmed."
                    className="w-full bg-[#111C18] border border-[#233730] focus:border-[#B7F34A] rounded-xl p-3 text-xs text-white focus:outline-none font-mono"
                  />
                  <span className="text-[11px] text-slate-400 block">
                    Saved directly to the order and displayed to customer in their Order History & Downloads portal.
                  </span>
                </div>

                {/* Admin Status Actions */}
                <div className="space-y-4 pt-4 border-t border-[#233730]">
                  <span className="text-xs font-bold text-white block">Update Order & Payment Status:</span>
                  <div className="flex flex-wrap gap-2.5">
                    <button
                      onClick={() => handleUpdateOrderStatus(
                        selectedOrder.id,
                        'Payment Confirmed',
                        'Processing',
                        'Ready for Delivery',
                        'Payment verified against Easypaisa statement',
                        adminDeliveryInput
                      )}
                      className="bg-emerald-500 hover:bg-emerald-600 text-[#111C18] font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 cursor-pointer"
                    >
                      <CheckCircle className="w-4 h-4" /> Confirm Payment & Mark Ready
                    </button>

                    <button
                      onClick={() => handleUpdateOrderStatus(
                        selectedOrder.id,
                        'Payment Confirmed',
                        'Completed',
                        'Delivered',
                        'Access link sent on WhatsApp and portal',
                        adminDeliveryInput
                      )}
                      className="bg-[#B7F34A] hover:bg-[#A3E037] text-[#111C18] font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 cursor-pointer"
                    >
                      <CheckCircle className="w-4 h-4" /> Mark as Delivered
                    </button>

                    <button
                      onClick={() => {
                        const note = prompt('Enter rejection reason (e.g. Invalid TRX ID or Amount Mismatch):');
                        if (note) {
                          handleUpdateOrderStatus(
                            selectedOrder.id,
                            'Payment Proof Rejected',
                            'Cancelled',
                            'Awaiting Payment',
                            note
                          );
                        }
                      }}
                      className="bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 cursor-pointer"
                    >
                      <XCircle className="w-4 h-4" /> Reject Payment Proof
                    </button>
                  </div>
                </div>

                {/* Contact Customer on WhatsApp */}
                <div className="bg-[#1A2924] p-4 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-white block">Deliver product directly on WhatsApp</span>
                    <span className="text-slate-400">Open chat with prefilled order number.</span>
                  </div>
                  <a
                    href={`https://wa.me/${selectedOrder.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Salam ${selectedOrder.customerName}! Your payment for order ${selectedOrder.orderNumber} (Rs. ${selectedOrder.totalPKR}) has been confirmed. Here is your product access:`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-[#25D366] text-[#111C18] font-bold px-3 py-2 rounded-lg flex items-center gap-1.5"
                  >
                    <MessageCircle className="w-4 h-4" /> Message Customer
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: PRODUCT MANAGEMENT */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Product Catalog ({products.length})</h2>
            <button
              onClick={() => {
                setEditingProduct({
                  id: `prod-${Date.now()}`,
                  title: '',
                  slug: '',
                  category: 'Business Books',
                  description: '',
                  shortDescription: '',
                  images: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80'],
                  pricePKR: 1500,
                  currency: 'PKR',
                  tags: ['Featured'],
                  features: ['Instant Download'],
                  productType: 'ebook',
                  deliveryType: 'Direct Download Link',
                  featured: false,
                  status: 'draft',
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                });
                setIsProductModalOpen(true);
              }}
              className="bg-[#B7F34A] text-[#111C18] font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md shadow-[#B7F34A]/20"
            >
              <Plus className="w-4 h-4" /> Add Product
            </button>
          </div>

          <div className="bg-[#15231F] border border-[#233730] rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#111C18] text-slate-400 uppercase tracking-wider border-b border-[#233730]">
                  <tr>
                    <th className="py-3.5 px-4 font-semibold">Title</th>
                    <th className="py-3.5 px-4 font-semibold">Type</th>
                    <th className="py-3.5 px-4 font-semibold">Category</th>
                    <th className="py-3.5 px-4 font-semibold">Price (PKR)</th>
                    <th className="py-3.5 px-4 font-semibold">Status</th>
                    <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#233730]">
                  {products.map(prod => (
                    <tr key={prod.id} className="hover:bg-[#1A2924]/60 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={prod.images[0]}
                            alt={prod.title}
                            className="w-10 h-10 rounded-lg object-cover bg-black shrink-0"
                          />
                          <span className="font-bold text-white truncate max-w-xs">{prod.title}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-300 capitalize">{prod.productType}</td>
                      <td className="py-3 px-4 text-slate-300">{prod.category}</td>
                      <td className="py-3 px-4 font-bold text-white">Rs. {Math.round(prod.pricePKR).toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          prod.status === 'published'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}>
                          {prod.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <button
                          onClick={() => {
                            setEditingProduct({ ...prod });
                            setIsProductModalOpen(true);
                          }}
                          className="p-1.5 text-slate-300 hover:text-[#B7F34A] rounded-lg hover:bg-[#1A2924] cursor-pointer"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(prod.id)}
                          className="p-1.5 text-slate-300 hover:text-red-400 rounded-lg hover:bg-[#1A2924] cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* PRODUCT ADD/EDIT MODAL */}
          {isProductModalOpen && editingProduct && (
            <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-10 flex justify-center items-center">
              <div 
                className="fixed inset-0 bg-black/80 backdrop-blur-md"
                onClick={() => setIsProductModalOpen(false)}
              />

              <div className="relative bg-[#15231F] border border-[#233730] rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl z-10 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between border-b border-[#233730] pb-4">
                  <h2 className="text-xl font-extrabold text-white">
                    {editingProduct.id ? 'Edit Product' : 'Add New Product'}
                  </h2>
                  <button
                    onClick={() => setIsProductModalOpen(false)}
                    className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-[#1A2924] cursor-pointer"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Product Title</label>
                    <input
                      type="text"
                      required
                      value={editingProduct.title}
                      onChange={(e) => {
                        const title = e.target.value;
                        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                        setEditingProduct({ ...editingProduct, title, slug });
                      }}
                      className="w-full bg-[#1A2924] border border-[#233730] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#B7F34A]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">Product Type</label>
                      <select
                        value={editingProduct.productType}
                        onChange={(e: any) => setEditingProduct({ ...editingProduct, productType: e.target.value })}
                        className="w-full bg-[#1A2924] border border-[#233730] rounded-xl px-3 py-2 text-white focus:outline-none"
                      >
                        <option value="ebook">E-Book</option>
                        <option value="software">Software & Tool</option>
                        <option value="course">Online Course</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">Category</label>
                      <input
                        type="text"
                        required
                        value={editingProduct.category}
                        onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                        className="w-full bg-[#1A2924] border border-[#233730] rounded-xl px-3 py-2 text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">Price (PKR - Integer)</label>
                      <input
                        type="number"
                        required
                        min="0"
                        value={editingProduct.pricePKR}
                        onChange={(e) => setEditingProduct({ ...editingProduct, pricePKR: parseInt(e.target.value) || 0 })}
                        className="w-full bg-[#1A2924] border border-[#233730] rounded-xl px-3 py-2 text-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">Status</label>
                      <select
                        value={editingProduct.status}
                        onChange={(e: any) => setEditingProduct({ ...editingProduct, status: e.target.value })}
                        className="w-full bg-[#1A2924] border border-[#233730] rounded-xl px-3 py-2 text-white focus:outline-none"
                      >
                        <option value="published">Published (Available for Purchase)</option>
                        <option value="draft">Draft (Unverified / Hidden from Cart)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Image URL</label>
                    <input
                      type="url"
                      required
                      value={editingProduct.images[0] || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, images: [e.target.value] })}
                      className="w-full bg-[#1A2924] border border-[#233730] rounded-xl px-3 py-2 text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Short Description</label>
                    <input
                      type="text"
                      value={editingProduct.shortDescription || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, shortDescription: e.target.value })}
                      className="w-full bg-[#1A2924] border border-[#233730] rounded-xl px-3 py-2 text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Full Description</label>
                    <textarea
                      rows={4}
                      required
                      value={editingProduct.description}
                      onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                      className="w-full bg-[#1A2924] border border-[#233730] rounded-xl px-3 py-2 text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Licensing & Verification Disclosures</label>
                    <input
                      type="text"
                      value={editingProduct.licensingNotes || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, licensingNotes: e.target.value })}
                      placeholder="e.g. Authorized team invitation model, terms subject to provider policy."
                      className="w-full bg-[#1A2924] border border-[#233730] rounded-xl px-3 py-2 text-white focus:outline-none"
                    />
                  </div>

                  <div className="pt-4 border-t border-[#233730] flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsProductModalOpen(false)}
                      className="bg-[#1A2924] text-slate-300 px-4 py-2 rounded-xl cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-[#B7F34A] text-[#111C18] font-bold px-6 py-2 rounded-xl cursor-pointer"
                    >
                      Save Product
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: BLOG POSTS MANAGEMENT */}
      {activeTab === 'blogs' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Articles & Tutorials ({blogPosts.length})</h2>
            <button
              onClick={() => {
                setEditingBlog({
                  id: `blog-${Date.now()}`,
                  title: '',
                  slug: '',
                  excerpt: '',
                  content: '',
                  coverImage: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80',
                  author: 'Editorial Team',
                  category: 'Business and Entrepreneurship',
                  tags: ['Skills', 'Guides'],
                  status: 'published',
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                });
                setIsBlogModalOpen(true);
              }}
              className="bg-[#B7F34A] text-[#111C18] font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md shadow-[#B7F34A]/20"
            >
              <Plus className="w-4 h-4" /> New Article
            </button>
          </div>

          <div className="bg-[#15231F] border border-[#233730] rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#111C18] text-slate-400 uppercase tracking-wider border-b border-[#233730]">
                  <tr>
                    <th className="py-3.5 px-4 font-semibold">Title</th>
                    <th className="py-3.5 px-4 font-semibold">Category</th>
                    <th className="py-3.5 px-4 font-semibold">Author</th>
                    <th className="py-3.5 px-4 font-semibold">Status</th>
                    <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#233730]">
                  {blogPosts.map(post => (
                    <tr key={post.id} className="hover:bg-[#1A2924]/60 transition-colors">
                      <td className="py-3 px-4 font-bold text-white max-w-sm truncate">{post.title}</td>
                      <td className="py-3 px-4 text-slate-300">{post.category}</td>
                      <td className="py-3 px-4 text-slate-400">{post.author}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          post.status === 'published' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-300'
                        }`}>
                          {post.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <button
                          onClick={() => {
                            setEditingBlog({ ...post });
                            setIsBlogModalOpen(true);
                          }}
                          className="p-1.5 text-slate-300 hover:text-[#B7F34A] rounded-lg cursor-pointer"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteBlog(post.id)}
                          className="p-1.5 text-slate-300 hover:text-red-400 rounded-lg cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* BLOG MODAL */}
          {isBlogModalOpen && editingBlog && (
            <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-10 flex justify-center items-center">
              <div 
                className="fixed inset-0 bg-black/80 backdrop-blur-md"
                onClick={() => setIsBlogModalOpen(false)}
              />

              <div className="relative bg-[#15231F] border border-[#233730] rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl z-10 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between border-b border-[#233730] pb-4">
                  <h2 className="text-xl font-extrabold text-white">
                    {editingBlog.id ? 'Edit Article' : 'New Article'}
                  </h2>
                  <button
                    onClick={() => setIsBlogModalOpen(false)}
                    className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-[#1A2924] cursor-pointer"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSaveBlog} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Article Title</label>
                    <input
                      type="text"
                      required
                      value={editingBlog.title}
                      onChange={(e) => {
                        const title = e.target.value;
                        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                        setEditingBlog({ ...editingBlog, title, slug });
                      }}
                      className="w-full bg-[#1A2924] border border-[#233730] rounded-xl px-3 py-2 text-white focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">Category</label>
                      <input
                        type="text"
                        required
                        value={editingBlog.category}
                        onChange={(e) => setEditingBlog({ ...editingBlog, category: e.target.value })}
                        className="w-full bg-[#1A2924] border border-[#233730] rounded-xl px-3 py-2 text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">Author</label>
                      <input
                        type="text"
                        required
                        value={editingBlog.author}
                        onChange={(e) => setEditingBlog({ ...editingBlog, author: e.target.value })}
                        className="w-full bg-[#1A2924] border border-[#233730] rounded-xl px-3 py-2 text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Cover Image URL</label>
                    <input
                      type="url"
                      required
                      value={editingBlog.coverImage}
                      onChange={(e) => setEditingBlog({ ...editingBlog, coverImage: e.target.value })}
                      className="w-full bg-[#1A2924] border border-[#233730] rounded-xl px-3 py-2 text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Excerpt</label>
                    <textarea
                      rows={2}
                      required
                      value={editingBlog.excerpt}
                      onChange={(e) => setEditingBlog({ ...editingBlog, excerpt: e.target.value })}
                      className="w-full bg-[#1A2924] border border-[#233730] rounded-xl px-3 py-2 text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Article Content (Markdown supported)</label>
                    <textarea
                      rows={6}
                      required
                      value={editingBlog.content}
                      onChange={(e) => setEditingBlog({ ...editingBlog, content: e.target.value })}
                      className="w-full bg-[#1A2924] border border-[#233730] rounded-xl px-3 py-2 text-white focus:outline-none font-mono text-xs"
                    />
                  </div>

                  <div className="pt-4 border-t border-[#233730] flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsBlogModalOpen(false)}
                      className="bg-[#1A2924] text-slate-300 px-4 py-2 rounded-xl cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-[#B7F34A] text-[#111C18] font-bold px-6 py-2 rounded-xl cursor-pointer"
                    >
                      Publish Article
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 5: STORE SETTINGS & EASYPAISA CONFIGURATION */}
      {activeTab === 'settings' && (
        <div className="bg-[#15231F] border border-[#233730] rounded-3xl p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-xl font-extrabold text-white">Global Store & Easypaisa Configuration</h2>
            <p className="text-xs text-slate-400 mt-1">
              Changes saved here immediately update the checkout payment screen, customer instructions, and footer.
            </p>
          </div>

          {settingsSaveSuccess && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs p-3 rounded-xl flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>Store settings saved successfully!</span>
            </div>
          )}

          <form onSubmit={handleSaveSettings} className="space-y-6 text-xs">
            {/* Easypaisa Dedicated Section */}
            <div className="bg-[#111C18] border-2 border-[#B7F34A]/40 rounded-2xl p-5 space-y-4">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#B7F34A]"></span>
                <span>Easypaisa Payment Account Details</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Easypaisa Account Holder Name
                  </label>
                  <input
                    type="text"
                    required
                    value={settingsForm.easypaisaAccountName}
                    onChange={(e) => setSettingsForm({ ...settingsForm, easypaisaAccountName: e.target.value })}
                    placeholder="e.g. MUHAMMAD KUMAIL ALI"
                    className="w-full bg-[#1A2924] border border-[#233730] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#B7F34A]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Easypaisa Account / Mobile Number
                  </label>
                  <input
                    type="text"
                    required
                    value={settingsForm.easypaisaNumber}
                    onChange={(e) => setSettingsForm({ ...settingsForm, easypaisaNumber: e.target.value })}
                    placeholder="e.g. 03010333544"
                    className="w-full bg-[#1A2924] border border-[#233730] rounded-xl px-4 py-2.5 text-[#B7F34A] font-bold text-sm focus:outline-none focus:border-[#B7F34A]"
                  />
                </div>
              </div>
            </div>

            {/* General Contact Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Business Name</label>
                <input
                  type="text"
                  required
                  value={settingsForm.businessName}
                  onChange={(e) => setSettingsForm({ ...settingsForm, businessName: e.target.value })}
                  className="w-full bg-[#1A2924] border border-[#233730] rounded-xl px-4 py-2 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Support WhatsApp Number</label>
                <input
                  type="text"
                  required
                  value={settingsForm.whatsappNumber}
                  onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                  className="w-full bg-[#1A2924] border border-[#233730] rounded-xl px-4 py-2 text-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Support Email</label>
              <input
                type="email"
                required
                value={settingsForm.supportEmail}
                onChange={(e) => setSettingsForm({ ...settingsForm, supportEmail: e.target.value })}
                className="w-full bg-[#1A2924] border border-[#233730] rounded-xl px-4 py-2 text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Payment Instructions (Displayed to Buyer)</label>
              <textarea
                rows={4}
                value={settingsForm.paymentInstructions}
                onChange={(e) => setSettingsForm({ ...settingsForm, paymentInstructions: e.target.value })}
                className="w-full bg-[#1A2924] border border-[#233730] rounded-xl px-4 py-2 text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">International Payment Instructions</label>
              <textarea
                rows={2}
                value={settingsForm.internationalPaymentInstructions}
                onChange={(e) => setSettingsForm({ ...settingsForm, internationalPaymentInstructions: e.target.value })}
                className="w-full bg-[#1A2924] border border-[#233730] rounded-xl px-4 py-2 text-white focus:outline-none"
              />
            </div>

            <div className="pt-4 border-t border-[#233730]">
              <button
                type="submit"
                className="bg-[#B7F34A] text-[#111C18] font-extrabold text-sm px-6 py-3 rounded-xl flex items-center gap-2 cursor-pointer shadow-lg shadow-[#B7F34A]/20"
              >
                <Save className="w-4 h-4" /> Save Store Settings
              </button>
            </div>
          </form>

          {/* Admin Security & Passcode Settings */}
          <div className="border-t border-[#233730] pt-6 mt-6 space-y-4">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#B7F34A]" />
              <h3 className="font-bold text-white text-sm">Administrator Security & Passcode</h3>
            </div>
            <p className="text-xs text-slate-400">
              Authorized admin account: <span className="text-white font-medium">{MASTER_ADMIN_EMAIL}</span>. 
              You can set or update your custom admin passcode anytime.
            </p>

            <div className="bg-[#111C18] border border-[#233730] rounded-2xl p-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={customPasscodeSetting}
                  onChange={(e) => setCustomPasscodeSetting(e.target.value)}
                  placeholder="Enter new admin passcode (min 4 chars)"
                  className="w-full bg-[#1A2924] border border-[#233730] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#B7F34A]"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  if (customPasscodeSetting.trim().length >= 4) {
                    updateAdminPasscode(customPasscodeSetting.trim());
                    showToast('Admin passcode updated successfully!', 'success');
                    setCustomPasscodeSetting('');
                  } else {
                    showToast('Passcode must be at least 4 characters long', 'error');
                  }
                }}
                className="bg-[#1A2924] hover:bg-[#233730] border border-[#B7F34A]/40 text-[#B7F34A] font-bold text-xs px-4 py-2.5 rounded-xl cursor-pointer flex items-center justify-center gap-2 shrink-0"
              >
                <KeyRound className="w-4 h-4" />
                <span>Save New Passcode</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB: VERCEL CUSTOM DOMAIN */}
      {activeTab === 'domain' && (
        <VercelDomainManager
          settings={settingsForm}
          onSettingsUpdated={(updated) => {
            setSettingsForm(updated);
            onRefreshData();
          }}
        />
      )}

      {/* TAB 6: AI CONTENT ASSISTANT (Optional Gemini Integration) */}
      {activeTab === 'ai' && (
        <div className="bg-[#15231F] border border-[#233730] rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#B7F34A]" />
            <h2 className="text-xl font-extrabold text-white">AI Content Assistant (Server-Side Gemini)</h2>
          </div>
          <p className="text-xs text-slate-400">
            Draft marketing descriptions, blog outlines, and FAQs without exposing API credentials to the browser.
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Prompt / Content Brief
              </label>
              <textarea
                rows={3}
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="e.g. Write an enticing 3-sentence description and 4 bullet points for a CapCut Pro video editing course in Urdu."
                className="w-full bg-[#1A2924] border border-[#233730] focus:border-[#B7F34A] rounded-xl p-3 text-xs text-white focus:outline-none"
              />
            </div>

            <button
              onClick={handleGenerateAi}
              disabled={isAiLoading || !aiPrompt.trim()}
              className="bg-[#B7F34A] text-[#111C18] font-bold text-xs px-5 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isAiLoading ? 'Drafting with Gemini...' : 'Generate Content'}
            </button>

            {aiResult && (
              <div className="bg-[#111C18] border border-[#233730] rounded-2xl p-4 space-y-2">
                <span className="text-xs font-bold text-[#B7F34A]">Generated Output:</span>
                <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed font-mono">
                  {aiResult}
                </p>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(aiResult);
                    showToast('Copied to clipboard!', 'success');
                  }}
                  className="bg-[#1A2924] text-slate-300 text-xs px-3 py-1.5 rounded-lg hover:text-white cursor-pointer mt-2"
                >
                  Copy Generated Draft
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-5 py-3 rounded-2xl shadow-2xl text-xs font-bold transition-all border ${
          toast.type === 'success'
            ? 'bg-[#15231F] border-[#B7F34A] text-[#B7F34A] shadow-[#B7F34A]/20'
            : 'bg-red-950/90 border-red-500 text-red-200'
        }`}>
          {toast.type === 'success' ? (
            <CheckCircle className="w-4 h-4 text-[#B7F34A]" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-400" />
          )}
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
};
