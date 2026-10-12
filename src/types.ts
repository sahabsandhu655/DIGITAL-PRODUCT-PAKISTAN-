export type ProductType = 'ebook' | 'software' | 'course';
export type ProductStatus = 'published' | 'draft' | 'archived';

export interface Product {
  id: string;
  title: string;
  slug: string;
  category: string;
  subcategory?: string;
  description: string;
  shortDescription?: string;
  images: string[];
  pricePKR: number;
  compareAtPricePKR?: number;
  currency: string;
  tags: string[];
  features: string[];
  productType: ProductType;
  deliveryType: string;
  downloadUrl?: string;
  offerType?: string;
  validity?: string;
  specifications?: Record<string, string>;
  licensingNotes?: string;
  featured: boolean;
  status: ProductStatus;
  language?: string;
  courseFormat?: string;
  lessonsCount?: number;
  instructor?: string;
  collectionSizeClaim?: string;
  seoTitle?: string;
  metaDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type PaymentStatus = 
  | 'Awaiting Payment'
  | 'Payment Proof Submitted'
  | 'Under Review'
  | 'Payment Confirmed'
  | 'Payment Proof Rejected'
  | 'Refunded'
  | 'Cancelled';

export type OrderStatus =
  | 'Pending Verification'
  | 'Processing'
  | 'Completed'
  | 'Cancelled';

export type DeliveryStatus =
  | 'Awaiting Payment'
  | 'Ready for Delivery'
  | 'Delivered';

export interface OrderItemSnapshot {
  productId: string;
  title: string;
  pricePKR: number;
  quantity: number;
  productType: ProductType;
  deliveryType?: string;
  downloadUrl?: string;
  image?: string;
}

export interface DownloadLinkItem {
  title: string;
  url: string;
  note?: string;
  type?: 'pdf' | 'drive' | 'portal' | 'credentials';
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  email?: string;
  country: string;
  items: OrderItemSnapshot[];
  subtotalPKR: number;
  discountPKR: number;
  totalPKR: number;
  currency: string;
  paymentMethod: 'Easypaisa' | 'International / Other';
  paymentProofPath?: string;
  paymentProofUrl?: string; // secure base64 or storage url
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  deliveryStatus: DeliveryStatus;
  downloadLinks?: DownloadLinkItem[];
  customerNote?: string;
  adminNote?: string;
  deliveryInstructions?: string;
  createdAt: string;
  updatedAt: string;
  paymentConfirmedAt?: string;
  deliveredAt?: string;
}

export type BlogPostStatus = 'published' | 'draft' | 'archived';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  imageAlt?: string;
  author: string;
  category: string;
  tags: string[];
  relatedProductIds?: string[];
  status: BlogPostStatus;
  publishedAt?: string;
  seoTitle?: string;
  metaDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StoreSettings {
  id?: string;
  businessName: string;
  logo?: string;
  supportEmail: string;
  whatsappNumber: string;
  easypaisaAccountName: string;
  easypaisaNumber: string;
  paymentInstructions: string;
  internationalPaymentInstructions: string;
  currency: string;
  announcement?: string;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
    telegram?: string;
  };
  policies?: {
    refund?: string;
    delivery?: string;
    privacy?: string;
    terms?: string;
  };
  customDomain?: string;
  netlifySiteName?: string;
  vercelProjectName?: string;
  deploymentPlatform?: 'vercel' | 'netlify';
  dnsMethod?: 'external' | 'vercel-dns' | 'netlify-dns';
  updatedAt?: string;
}

export interface AdminUser {
  uid: string;
  email: string | null;
  isAdmin: boolean;
}
