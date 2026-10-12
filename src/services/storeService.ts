import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '../firebase';
import { Product, BlogPost, StoreSettings, Order } from '../types';
import { INITIAL_PRODUCTS, INITIAL_BLOG_POSTS, INITIAL_STORE_SETTINGS } from '../data/seedData';

const PRODUCTS_COLLECTION = 'products';
const BLOGS_COLLECTION = 'blogPosts';
const SETTINGS_COLLECTION = 'storeSettings';
const ORDERS_COLLECTION = 'orders';
const GLOBAL_SETTINGS_ID = 'global_settings';

// Safe localStorage helper
function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const item = localStorage.getItem(key);
      if (item) {
        return JSON.parse(item);
      }
    }
  } catch (e) {
    console.warn(`Error reading ${key} from storage:`, e);
  }
  return fallback;
}

function saveToStorage(key: string, data: any) {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(key, JSON.stringify(data));
    }
  } catch (e) {
    console.warn(`Error saving ${key} to storage:`, e);
  }
}

// Cache in-memory with resilient localStorage backing
function getInitialProductsWithDraftMigration(): Product[] {
  const loaded = loadFromStorage('dpp_custom_products', [...INITIAL_PRODUCTS]);
  // Ensure that all seeded software items or user items that should be online are published
  let modified = false;
  const migrated = loaded.map(p => {
    // If it was one of the initial software products or currently marked as draft, bring it online
    if (p.id.startsWith('prod-soft-') && p.status === 'draft') {
      modified = true;
      return { ...p, status: 'published' as const };
    }
    return p;
  });
  if (modified) {
    saveToStorage('dpp_custom_products', migrated);
  }
  return migrated;
}

let localProducts: Product[] = getInitialProductsWithDraftMigration();
let localBlogs: BlogPost[] = loadFromStorage('dpp_custom_blogs', [...INITIAL_BLOG_POSTS]);
let localSettings: StoreSettings = loadFromStorage('dpp_custom_settings', { ...INITIAL_STORE_SETTINGS });
let localOrders: Order[] = loadFromStorage('dpp_submitted_orders', []);

// PRODUCTS
export async function getProducts(includeDrafts = false): Promise<Product[]> {
  // 1. Try Firestore primary source of truth
  try {
    const colRef = collection(db, PRODUCTS_COLLECTION);
    const snap = await getDocs(colRef);
    if (!snap.empty) {
      const items: Product[] = [];
      snap.forEach(d => {
        const data = d.data() as Product;
        items.push({ ...data, id: d.id });
      });
      localProducts = items;
      saveToStorage('dpp_custom_products', items);

      // Async sync server backend store in background
      fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products: items }),
      }).catch(() => {});

      return includeDrafts ? items : items.filter(p => p.status === 'published');
    }
  } catch (err) {
    console.warn('Firestore products fetch warning, trying server backend:', err);
  }

  // 2. Try Server backend API
  try {
    const res = await fetch('/api/products');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.products) && data.products.length > 0) {
        localProducts = data.products;
        saveToStorage('dpp_custom_products', data.products);
        return includeDrafts ? data.products : data.products.filter((p: any) => p.status === 'published');
      }
    }
  } catch (err) {
    console.warn('Backend API fetch error, using resilient local storage:', err);
  }

  // 3. Resilient local fallback
  return includeDrafts ? localProducts : localProducts.filter(p => p.status === 'published');
}

// Real-time listener for live sync across customer and admin screens
export function subscribeToProducts(callback: (products: Product[]) => void): () => void {
  try {
    const colRef = collection(db, PRODUCTS_COLLECTION);
    const unsubscribe = onSnapshot(colRef, (snap) => {
      if (!snap.empty) {
        const items: Product[] = [];
        snap.forEach(d => {
          items.push({ ...(d.data() as Product), id: d.id });
        });
        localProducts = items;
        saveToStorage('dpp_custom_products', items);
        callback(items);
      }
    }, (err) => {
      console.warn('Firestore onSnapshot subscription warning:', err);
    });
    return unsubscribe;
  } catch (e) {
    console.warn('Could not register onSnapshot:', e);
    return () => {};
  }
}

// Publish single product online immediately
export async function publishProduct(productId: string): Promise<Product | null> {
  const target = localProducts.find(p => p.id === productId);
  if (!target) return null;
  const updated: Product = {
    ...target,
    status: 'published',
    updatedAt: new Date().toISOString(),
  };
  await saveProduct(updated);
  return updated;
}

// Publish all draft products online in one click
export async function publishAllDraftProducts(): Promise<Product[]> {
  const updatedList = localProducts.map(p => {
    if (p.status === 'draft') {
      return {
        ...p,
        status: 'published' as const,
        updatedAt: new Date().toISOString(),
      };
    }
    return p;
  });
  localProducts = updatedList;
  saveToStorage('dpp_custom_products', localProducts);

  // Sync to Backend server
  try {
    await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ products: localProducts }),
    });
  } catch (err) {
    console.warn('Server bulk publish sync warning:', err);
  }

  // Sync to Firestore in background
  try {
    const updates = localProducts.map(p => setDoc(doc(db, PRODUCTS_COLLECTION, p.id), p));
    await Promise.allSettled(updates);
  } catch (err) {
    console.warn('Firestore bulk publish sync warning:', err);
  }

  // Dispatch event for UI re-render
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('dpp_products_updated', { detail: localProducts }));
  }

  return localProducts;
}

// Toggle product status between published and draft
export async function toggleProductStatus(productId: string): Promise<Product | null> {
  const target = localProducts.find(p => p.id === productId);
  if (!target) return null;
  const nextStatus = target.status === 'published' ? 'draft' : 'published';
  const updated: Product = {
    ...target,
    status: nextStatus,
    updatedAt: new Date().toISOString(),
  };
  await saveProduct(updated);
  return updated;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const colRef = collection(db, PRODUCTS_COLLECTION);
    const q = query(colRef, where('slug', '==', slug));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const docSnap = snap.docs[0];
      return { ...docSnap.data(), id: docSnap.id } as Product;
    }
  } catch (err) {
    console.warn('Firestore slug query error:', err);
  }
  return localProducts.find(p => p.slug === slug) || null;
}

export async function saveProduct(product: Product): Promise<void> {
  const docId = product.id || `prod-${Date.now()}`;
  const payload: Product = {
    ...product,
    id: docId,
    updatedAt: new Date().toISOString(),
    createdAt: product.createdAt || new Date().toISOString(),
  };

  // 1. Immediately persist locally
  const idx = localProducts.findIndex(p => p.id === docId);
  if (idx >= 0) {
    localProducts[idx] = payload;
  } else {
    localProducts.unshift(payload);
  }
  saveToStorage('dpp_custom_products', localProducts);

  // 2. Sync to Backend server API so all customers & Chatbot know the new price immediately
  try {
    await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.warn('Backend server product sync warning:', err);
  }

  // 3. Sync to Firestore database in background
  try {
    await setDoc(doc(db, PRODUCTS_COLLECTION, docId), payload);
  } catch (err) {
    console.warn('Firestore write warning:', err);
  }

  // 4. Notify app components
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('dpp_products_updated', { detail: payload }));
  }
}

export async function deleteProduct(productId: string): Promise<void> {
  // 1. Remove from local store immediately
  localProducts = localProducts.filter(p => p.id !== productId);
  saveToStorage('dpp_custom_products', localProducts);

  // 2. Sync to server backend
  try {
    await fetch('/api/products', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: productId }),
    });
  } catch (err) {
    console.warn('Backend server product delete warning:', err);
  }

  // 3. Sync deletion to Firestore
  try {
    await deleteDoc(doc(db, PRODUCTS_COLLECTION, productId));
  } catch (err) {
    console.warn('Firestore delete warning (product removed locally):', err);
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('dpp_products_updated', { detail: { id: productId, deleted: true } }));
  }
}

// BLOG POSTS
export async function getBlogPosts(includeDrafts = false): Promise<BlogPost[]> {
  try {
    const colRef = collection(db, BLOGS_COLLECTION);
    const snap = await getDocs(colRef);
    if (!snap.empty) {
      const items: BlogPost[] = [];
      snap.forEach(d => {
        const data = d.data() as BlogPost;
        items.push({ ...data, id: d.id });
      });
      localBlogs = items;
      saveToStorage('dpp_custom_blogs', items);
      return includeDrafts ? items : items.filter(b => b.status === 'published');
    }
  } catch (err) {
    console.warn('Firestore blogs fetch error, using local fallback:', err);
  }
  return includeDrafts ? localBlogs : localBlogs.filter(b => b.status === 'published');
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const colRef = collection(db, BLOGS_COLLECTION);
    const q = query(colRef, where('slug', '==', slug));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const docSnap = snap.docs[0];
      return { ...docSnap.data(), id: docSnap.id } as BlogPost;
    }
  } catch (err) {
    console.warn('Firestore blog slug fetch error:', err);
  }
  return localBlogs.find(b => b.slug === slug) || null;
}

export async function saveBlogPost(post: BlogPost): Promise<void> {
  const docId = post.id || `blog-${Date.now()}`;
  const payload: BlogPost = {
    ...post,
    id: docId,
    updatedAt: new Date().toISOString(),
    createdAt: post.createdAt || new Date().toISOString(),
  };

  // 1. Immediately persist locally
  const idx = localBlogs.findIndex(b => b.id === docId);
  if (idx >= 0) {
    localBlogs[idx] = payload;
  } else {
    localBlogs.unshift(payload);
  }
  saveToStorage('dpp_custom_blogs', localBlogs);

  // 2. Sync to Firestore
  try {
    await setDoc(doc(db, BLOGS_COLLECTION, docId), payload);
  } catch (err) {
    console.warn('Firestore blog write warning (article saved locally):', err);
  }
}

export async function deleteBlogPost(postId: string): Promise<void> {
  // 1. Remove locally
  localBlogs = localBlogs.filter(b => b.id !== postId);
  saveToStorage('dpp_custom_blogs', localBlogs);

  // 2. Sync to Firestore
  try {
    await deleteDoc(doc(db, BLOGS_COLLECTION, postId));
  } catch (err) {
    console.warn('Firestore delete blog warning:', err);
  }
}

// STORE SETTINGS
export async function getStoreSettings(): Promise<StoreSettings> {
  try {
    const docRef = doc(db, SETTINGS_COLLECTION, GLOBAL_SETTINGS_ID);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      localSettings = { ...localSettings, ...(snap.data() as StoreSettings) };
      saveToStorage('dpp_custom_settings', localSettings);
      return localSettings;
    }
  } catch (err) {
    console.warn('Firestore store settings fetch error, using resilient defaults:', err);
  }
  return localSettings;
}

export async function saveStoreSettings(settings: StoreSettings): Promise<void> {
  const payload: StoreSettings = {
    ...settings,
    updatedAt: new Date().toISOString(),
  };

  // 1. Immediately persist locally
  localSettings = payload;
  saveToStorage('dpp_custom_settings', payload);

  // 2. Sync to Firestore
  try {
    await setDoc(doc(db, SETTINGS_COLLECTION, GLOBAL_SETTINGS_ID), payload, { merge: true });
  } catch (err) {
    console.warn('Firestore store settings write warning (saved locally):', err);
  }
}

// ORDERS
export async function submitOrder(orderData: Omit<Order, 'id'>): Promise<Order> {
  const docId = `order-${orderData.orderNumber || Date.now()}`;
  const order: Order = {
    ...orderData,
    id: docId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    paymentStatus: orderData.paymentStatus || 'Payment Proof Submitted',
    orderStatus: 'Pending Verification',
    deliveryStatus: 'Awaiting Payment',
  };

  // 1. Persist locally
  localOrders.unshift(order);
  saveToStorage('dpp_submitted_orders', localOrders.slice(0, 50));

  // 2. Sync to Firestore
  try {
    await setDoc(doc(db, ORDERS_COLLECTION, docId), order);
  } catch (err) {
    console.warn('Direct Firestore order submission warning, saved in local registry:', err);
  }

  return order;
}

export async function getOrders(): Promise<Order[]> {
  try {
    const colRef = collection(db, ORDERS_COLLECTION);
    const q = query(colRef, orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const items: Order[] = [];
      snap.forEach(d => {
        items.push({ ...(d.data() as Order), id: d.id });
      });
      localOrders = items;
      saveToStorage('dpp_submitted_orders', items.slice(0, 50));
      return items;
    }
  } catch (err) {
    console.warn('Orders fetch error from Firestore (admin permission or empty):', err);
  }

  // Load from persisted local storage if available
  const saved = loadFromStorage<Order[]>('dpp_submitted_orders', []);
  if (Array.isArray(saved) && saved.length > 0) {
    return saved;
  }

  return localOrders;
}

export async function getOrderById(orderIdOrNumber: string): Promise<Order | null> {
  const cleanId = orderIdOrNumber.trim();
  const directDocId = cleanId.startsWith('order-') ? cleanId : `order-${cleanId}`;

  // First try direct document lookup from Firestore
  try {
    const snap = await getDoc(doc(db, ORDERS_COLLECTION, directDocId));
    if (snap.exists()) {
      return { ...(snap.data() as Order), id: snap.id };
    }
    const snapRaw = await getDoc(doc(db, ORDERS_COLLECTION, cleanId));
    if (snapRaw.exists()) {
      return { ...(snapRaw.data() as Order), id: snapRaw.id };
    }
  } catch (err) {
    console.warn('Firestore single order lookup error:', err);
  }

  // Check in-memory local cache
  const inMem = localOrders.find(
    o => o.orderNumber.toLowerCase() === cleanId.toLowerCase() || o.id === cleanId || o.id === directDocId
  );
  if (inMem) return inMem;

  // Check localStorage
  const saved = loadFromStorage<Order[]>('dpp_submitted_orders', []);
  if (Array.isArray(saved)) {
    const found = saved.find(
      o => o.orderNumber.toLowerCase() === cleanId.toLowerCase() || o.id === cleanId || o.id === directDocId
    );
    if (found) return found;
  }

  return null;
}

export async function getCustomerOrders(phoneOrEmail?: string): Promise<Order[]> {
  const map = new Map<string, Order>();

  // 1. Load locally stored customer orders on this device
  const saved = loadFromStorage<Order[]>('dpp_submitted_orders', []);
  if (Array.isArray(saved)) {
    saved.forEach(o => map.set(o.orderNumber || o.id, o));
  }

  // Include in-memory localOrders
  localOrders.forEach(o => map.set(o.orderNumber || o.id, o));

  const list = Array.from(map.values());

  // 2. Refresh statuses from Firestore for each order
  const refreshedList: Order[] = [];
  for (const ord of list) {
    try {
      const docId = ord.id || `order-${ord.orderNumber}`;
      const snap = await getDoc(doc(db, ORDERS_COLLECTION, docId));
      if (snap.exists()) {
        refreshedList.push({ ...(snap.data() as Order), id: snap.id });
      } else {
        refreshedList.push(ord);
      }
    } catch {
      refreshedList.push(ord);
    }
  }

  // If phone or email filter is provided
  if (phoneOrEmail && phoneOrEmail.trim()) {
    const cleanQuery = phoneOrEmail.trim().toLowerCase();
    const digitsOnly = cleanQuery.replace(/[^0-9]/g, '');
    return refreshedList.filter(o => {
      const ordPhone = (o.phone || '').replace(/[^0-9]/g, '');
      const ordEmail = (o.email || '').toLowerCase();
      const ordNum = (o.orderNumber || '').toLowerCase();
      return (digitsOnly && ordPhone.includes(digitsOnly)) ||
             ordEmail.includes(cleanQuery) ||
             ordNum.includes(cleanQuery);
    });
  }

  return refreshedList;
}

export async function updateOrder(orderId: string, updates: Partial<Order>): Promise<void> {
  const payload = {
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  // 1. Update in local cache and storage immediately
  const idx = localOrders.findIndex(o => o.id === orderId);
  if (idx >= 0) {
    localOrders[idx] = { ...localOrders[idx], ...payload };
  }
  saveToStorage('dpp_submitted_orders', localOrders);

  // 2. Sync to Firestore
  try {
    await updateDoc(doc(db, ORDERS_COLLECTION, orderId), payload);
  } catch (err) {
    console.warn('Firestore order update warning (updated locally):', err);
  }
}
