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
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { Product, BlogPost, StoreSettings, Order } from '../types';
import { INITIAL_PRODUCTS, INITIAL_BLOG_POSTS, INITIAL_STORE_SETTINGS } from '../data/seedData';

const PRODUCTS_COLLECTION = 'products';
const BLOGS_COLLECTION = 'blogPosts';
const SETTINGS_COLLECTION = 'storeSettings';
const ORDERS_COLLECTION = 'orders';
const GLOBAL_SETTINGS_ID = 'global_settings';

// Cache in-memory to guarantee zero-latency fallback and offline resilience
let localProducts = [...INITIAL_PRODUCTS];
let localBlogs = [...INITIAL_BLOG_POSTS];
let localSettings = { ...INITIAL_STORE_SETTINGS };
let localOrders: Order[] = [];

// PRODUCTS
export async function getProducts(includeDrafts = false): Promise<Product[]> {
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
      return includeDrafts ? items : items.filter(p => p.status === 'published');
    }
  } catch (err) {
    console.warn('Firestore products fetch error, using resilient local catalog:', err);
  }
  return includeDrafts ? localProducts : localProducts.filter(p => p.status === 'published');
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
  const payload = {
    ...product,
    id: docId,
    updatedAt: new Date().toISOString(),
    createdAt: product.createdAt || new Date().toISOString(),
  };

  try {
    await setDoc(doc(db, PRODUCTS_COLLECTION, docId), payload);
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `${PRODUCTS_COLLECTION}/${docId}`);
  }

  const idx = localProducts.findIndex(p => p.id === docId);
  if (idx >= 0) {
    localProducts[idx] = payload;
  } else {
    localProducts.unshift(payload);
  }
}

export async function deleteProduct(productId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, PRODUCTS_COLLECTION, productId));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `${PRODUCTS_COLLECTION}/${productId}`);
  }
  localProducts = localProducts.filter(p => p.id !== productId);
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
  const payload = {
    ...post,
    id: docId,
    updatedAt: new Date().toISOString(),
    createdAt: post.createdAt || new Date().toISOString(),
  };

  try {
    await setDoc(doc(db, BLOGS_COLLECTION, docId), payload);
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `${BLOGS_COLLECTION}/${docId}`);
  }

  const idx = localBlogs.findIndex(b => b.id === docId);
  if (idx >= 0) {
    localBlogs[idx] = payload;
  } else {
    localBlogs.unshift(payload);
  }
}

export async function deleteBlogPost(postId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, BLOGS_COLLECTION, postId));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `${BLOGS_COLLECTION}/${postId}`);
  }
  localBlogs = localBlogs.filter(b => b.id !== postId);
}

// STORE SETTINGS
export async function getStoreSettings(): Promise<StoreSettings> {
  try {
    const docRef = doc(db, SETTINGS_COLLECTION, GLOBAL_SETTINGS_ID);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      localSettings = { ...localSettings, ...(snap.data() as StoreSettings) };
      return localSettings;
    }
  } catch (err) {
    console.warn('Firestore store settings fetch error, using defaults:', err);
  }
  return localSettings;
}

export async function saveStoreSettings(settings: StoreSettings): Promise<void> {
  const payload = {
    ...settings,
    updatedAt: new Date().toISOString(),
  };

  try {
    await setDoc(doc(db, SETTINGS_COLLECTION, GLOBAL_SETTINGS_ID), payload, { merge: true });
    localSettings = payload;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `${SETTINGS_COLLECTION}/${GLOBAL_SETTINGS_ID}`);
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

  try {
    await setDoc(doc(db, ORDERS_COLLECTION, docId), order);
  } catch (err) {
    console.warn('Direct Firestore order submission error, falling back to local registry:', err);
  }

  localOrders.unshift(order);
  try {
    const saved = localStorage.getItem('dpp_submitted_orders');
    const list = saved ? JSON.parse(saved) : [];
    list.unshift(order);
    localStorage.setItem('dpp_submitted_orders', JSON.stringify(list.slice(0, 50)));
  } catch (e) {
    // ignore local storage error
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
      return items;
    }
  } catch (err) {
    console.warn('Orders fetch error from Firestore (admin permission or empty):', err);
  }

  // Load from persisted local storage if available
  try {
    const saved = localStorage.getItem('dpp_submitted_orders');
    if (saved) {
      const list = JSON.parse(saved);
      if (Array.isArray(list) && list.length > 0) {
        return list;
      }
    }
  } catch (e) {
    // ignore
  }

  return localOrders;
}

export async function updateOrder(orderId: string, updates: Partial<Order>): Promise<void> {
  const payload = {
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  try {
    await updateDoc(doc(db, ORDERS_COLLECTION, orderId), payload);
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `${ORDERS_COLLECTION}/${orderId}`);
  }

  const idx = localOrders.findIndex(o => o.id === orderId);
  if (idx >= 0) {
    localOrders[idx] = { ...localOrders[idx], ...payload };
  }

  try {
    const saved = localStorage.getItem('dpp_submitted_orders');
    if (saved) {
      const list: Order[] = JSON.parse(saved);
      const updatedList = list.map(o => (o.id === orderId ? { ...o, ...payload } : o));
      localStorage.setItem('dpp_submitted_orders', JSON.stringify(updatedList));
    }
  } catch (e) {
    // ignore
  }
}
