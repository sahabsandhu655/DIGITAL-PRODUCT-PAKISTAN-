import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { SearchModal } from './components/SearchModal';
import { CustomerChatbot } from './components/CustomerChatbot';
import { HomePage } from './pages/HomePage';
import { EbooksPage } from './pages/EbooksPage';
import { SoftwarePage } from './pages/SoftwarePage';
import { CoursesPage } from './pages/CoursesPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { BlogIndexPage } from './pages/BlogIndexPage';
import { BlogPostPage } from './pages/BlogPostPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { LegalPages } from './pages/LegalPages';
import { OrderHistoryPage } from './pages/OrderHistoryPage';
import { 
  getProducts, 
  getBlogPosts, 
  getStoreSettings, 
  getProductBySlug, 
  getBlogPostBySlug,
  subscribeToProducts
} from './services/storeService';
import { Product, BlogPost, StoreSettings, Order } from './types';
import { INITIAL_STORE_SETTINGS } from './data/seedData';

function MainApp() {
  const { addToCart, setIsCartOpen } = useCart();

  // Navigation route
  const [currentRoute, setCurrentRoute] = useState<string>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  // Data state
  const [products, setProducts] = useState<Product[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [settings, setSettings] = useState<StoreSettings>(INITIAL_STORE_SETTINGS);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Initialize Data
  const loadData = async () => {
    try {
      const [prods, blogs, setts] = await Promise.all([
        getProducts(true),
        getBlogPosts(true),
        getStoreSettings(),
      ]);
      setProducts(prods);
      setBlogPosts(blogs);
      setSettings(setts);
    } catch (err) {
      console.warn('Initial data load warning:', err);
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    loadData();

    // 1. Real-time live Firestore listener across all customers & tabs
    const unsubscribeFirestore = subscribeToProducts((liveProds) => {
      if (liveProds && liveProds.length > 0) {
        setProducts(liveProds);
      }
    });

    // 2. Custom event listener for immediate same-page updates
    const handleProductsUpdated = () => {
      getProducts(true).then((prods) => {
        if (prods && prods.length > 0) {
          setProducts(prods);
        }
      }).catch(() => {});
    };

    window.addEventListener('dpp_products_updated', handleProductsUpdated);

    return () => {
      unsubscribeFirestore();
      window.removeEventListener('dpp_products_updated', handleProductsUpdated);
    };
  }, []);

  // Sync URL Pathname for seamless SPA Routing & page refresh
  useEffect(() => {
    const handleUrlChange = async () => {
      const path = window.location.pathname;

      if (path === '/' || path === '') {
        setCurrentRoute('home');
      } else if (path.startsWith('/product/')) {
        const slug = path.replace('/product/', '');
        const found = await getProductBySlug(slug);
        if (found) {
          setSelectedProduct(found);
          setCurrentRoute('product-detail');
        } else {
          setCurrentRoute('home');
        }
      } else if (path.startsWith('/blog/')) {
        const slug = path.replace('/blog/', '');
        const found = await getBlogPostBySlug(slug);
        if (found) {
          setSelectedBlog(found);
          setCurrentRoute('blog-post');
        } else {
          setCurrentRoute('blog');
        }
      } else if (path === '/ebooks') {
        setCurrentRoute('ebooks');
      } else if (path === '/software') {
        setCurrentRoute('software');
      } else if (path === '/courses') {
        setCurrentRoute('courses');
      } else if (path === '/blog') {
        setCurrentRoute('blog');
      } else if (path === '/orders' || path === '/my-orders') {
        setCurrentRoute('orders');
      } else if (path === '/checkout') {
        setCurrentRoute('checkout');
      } else if (path === '/admin') {
        setCurrentRoute('admin');
      } else if (path === '/about') {
        setCurrentRoute('about');
      } else if (path === '/contact') {
        setCurrentRoute('contact');
      } else if (path === '/delivery-policy') {
        setCurrentRoute('delivery-policy');
      } else if (path === '/refund-policy') {
        setCurrentRoute('refund-policy');
      } else if (path === '/privacy-policy') {
        setCurrentRoute('privacy-policy');
      } else if (path === '/terms') {
        setCurrentRoute('terms');
      }
    };

    handleUrlChange();
    window.addEventListener('popstate', handleUrlChange);
    return () => window.removeEventListener('popstate', handleUrlChange);
  }, []);

  // Route Navigator with HTML5 history pushState
  const navigateTo = (route: string) => {
    let targetPath = '/';
    if (route === 'home') targetPath = '/';
    else if (route === 'ebooks') targetPath = '/ebooks';
    else if (route === 'software') targetPath = '/software';
    else if (route === 'courses') targetPath = '/courses';
    else if (route === 'blog') targetPath = '/blog';
    else if (route === 'orders') targetPath = '/orders';
    else if (route === 'checkout') targetPath = '/checkout';
    else if (route === 'admin') targetPath = '/admin';
    else if (route === 'about') targetPath = '/about';
    else if (route === 'contact') targetPath = '/contact';
    else if (route === 'delivery-policy') targetPath = '/delivery-policy';
    else if (route === 'refund-policy') targetPath = '/refund-policy';
    else if (route === 'privacy-policy') targetPath = '/privacy-policy';
    else if (route === 'terms') targetPath = '/terms';

    if (window.location.pathname !== targetPath) {
      window.history.pushState({}, '', targetPath);
    }
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProduct = (prod: Product) => {
    setSelectedProduct(prod);
    window.history.pushState({}, '', `/product/${prod.slug}`);
    setCurrentRoute('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectBlog = (post: BlogPost) => {
    setSelectedBlog(post);
    window.history.pushState({}, '', `/blog/${post.slug}`);
    setCurrentRoute('blog-post');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBuyNow = (prod: Product) => {
    addToCart(prod, 1);
    navigateTo('checkout');
  };

  const handleOrderSuccess = (order: Order) => {
    setConfirmedOrder(order);
    setCurrentRoute('order-confirmation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#111C18] text-white flex flex-col font-sans">
      {/* Navigation */}
      <Navbar 
        currentRoute={currentRoute}
        onNavigate={navigateTo}
        onSearchClick={() => setSearchModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentRoute === 'home' && (
          <HomePage
            products={products}
            blogPosts={blogPosts}
            onSelectProduct={handleSelectProduct}
            onSelectBlog={handleSelectBlog}
            onNavigate={navigateTo}
          />
        )}

        {currentRoute === 'ebooks' && (
          <EbooksPage
            products={products}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {currentRoute === 'software' && (
          <SoftwarePage
            products={products}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {currentRoute === 'courses' && (
          <CoursesPage
            products={products}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {currentRoute === 'product-detail' && selectedProduct && (
          <ProductDetailPage
            product={selectedProduct}
            allProducts={products}
            onBack={() => navigateTo('home')}
            onSelectProduct={handleSelectProduct}
            onCheckoutNow={handleBuyNow}
          />
        )}

        {currentRoute === 'checkout' && (
          <CheckoutPage
            settings={settings}
            onOrderSuccess={handleOrderSuccess}
            onBack={() => navigateTo('home')}
          />
        )}

        {currentRoute === 'order-confirmation' && confirmedOrder && (
          <OrderConfirmationPage
            order={confirmedOrder}
            settings={settings}
            onContinueShopping={() => navigateTo('home')}
            onViewOrderHistory={() => navigateTo('orders')}
          />
        )}

        {currentRoute === 'orders' && (
          <OrderHistoryPage
            settings={settings}
            onBack={() => navigateTo('home')}
            onExploreProducts={() => navigateTo('ebooks')}
          />
        )}

        {currentRoute === 'blog' && (
          <BlogIndexPage
            posts={blogPosts}
            onSelectBlog={handleSelectBlog}
          />
        )}

        {currentRoute === 'blog-post' && selectedBlog && (
          <BlogPostPage
            post={selectedBlog}
            allPosts={blogPosts}
            allProducts={products}
            onBack={() => navigateTo('blog')}
            onSelectBlog={handleSelectBlog}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {currentRoute === 'admin' && (
          <AdminDashboard
            products={products}
            blogPosts={blogPosts}
            settings={settings}
            onRefreshData={loadData}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {['about', 'contact', 'delivery-policy', 'refund-policy', 'privacy-policy', 'terms'].includes(currentRoute) && (
          <LegalPages
            pageType={currentRoute as any}
            settings={settings}
            onBack={() => navigateTo('home')}
          />
        )}
      </main>

      {/* Cart Drawer */}
      <CartDrawer 
        onCheckout={() => navigateTo('checkout')}
      />

      {/* Search Modal */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        products={products.filter(p => p.status === 'published')}
        onSelectProduct={handleSelectProduct}
      />

      {/* Customer Gemini AI Chatbot & Admin Image Studio */}
      <CustomerChatbot
        products={products}
        settings={settings}
        onSelectProduct={handleSelectProduct}
        onProductUpdated={() => loadData()}
      />

      {/* Global Footer */}
      <Footer 
        onNavigate={navigateTo}
        whatsappNumber={settings.whatsappNumber}
        supportEmail={settings.supportEmail}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <MainApp />
      </CartProvider>
    </AuthProvider>
  );
}
