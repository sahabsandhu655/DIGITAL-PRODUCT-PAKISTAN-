import { COMPREHENSIVE_BLOG_ARTICLES } from './blogArticles';
import { Product, BlogPost, StoreSettings } from '../types';

export const INITIAL_STORE_SETTINGS: StoreSettings = {
  businessName: 'Digital Product Pakistan',
  logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
  supportEmail: 'support@digitalproductpakistan.com',
  whatsappNumber: '+923107759274',
  easypaisaAccountName: 'MUHAMMAD KUMAIL ALI',
  easypaisaNumber: '03010333544',
  paymentInstructions: `1. Open your Easypaisa Mobile App or dial *786#.
2. Send the exact total order amount in PKR to the Easypaisa Account details shown above.
3. Take a clear screenshot of the completed transaction showing the Transaction ID (TRX ID), date, and amount.
4. Upload the screenshot proof in the file upload area below.
5. Click "Submit Order for Verification". Our team manually verifies the transaction and delivers your digital credentials/access links via WhatsApp and Email.`,
  internationalPaymentInstructions: `For international customers outside Pakistan who cannot use Easypaisa, please contact our support team on WhatsApp at +923107759274 or email support@digitalproductpakistan.com before placing your order. We support secure international bank wire and alternative digital payment options upon manual request.`,
  currency: 'PKR',
  announcement: '🇵🇰 Official Software & Digital Tools • Order Directly on WhatsApp (+92 310 7759274) or Pay via Easypaisa!',
  policies: {
    refund: `Due to the non-tangible and irrevocable nature of digital licenses and software credentials, orders are non-refundable once credentials have been delivered and redeemed. If an access key is proven non-functional upon initial delivery and our team cannot resolve it within 24 hours, a direct replacement or refund is promptly issued.`,
    delivery: `All products are digital and delivered electronically. Orders placed directly via WhatsApp (+923107759274) are activated instantly. For on-site Easypaisa checkout, credentials and download links are dispatched to your WhatsApp and Email within 15 to 30 minutes after manual payment verification.`,
    privacy: `We respect your privacy. Customer contact numbers and payment screenshots are used strictly for order fulfillment, verification, and WhatsApp support. We never share or sell customer information.`,
    terms: `By placing an order on Digital Product Pakistan, you agree to submit legitimate payment proof for manual verification. We provide genuine subscriptions, shared licenses, and software tools subject to individual provider terms and warranty periods.`,
  },
  socialLinks: {
    facebook: 'https://facebook.com',
    instagram: 'https://instagram.com',
    youtube: 'https://youtube.com',
  },
  customDomain: 'digitalproductpakistan.net',
  vercelProjectName: 'digital-product-pakistan',
  netlifySiteName: 'digital-product-pakistan',
  deploymentPlatform: 'netlify',
  dnsMethod: 'external',
};

export const INITIAL_PRODUCTS: Product[] = [
  // 1. ChatGPT Pro
  {
    id: 'prod-chatgpt-pro',
    title: 'ChatGPT Pro',
    slug: 'chatgpt-pro',
    category: 'AI Software',
    description: `Get official ChatGPT Pro subscription access in Pakistan. Unlock OpenAI's flagship GPT-4o architecture, high-speed priority server allocation during peak hours, unlimited DALL-E 3 image generation, advanced code canvas, and deep analytical capabilities.\n\n• Dedicated priority access with zero rate bottlenecks.\n• Instant setup guidance and direct WhatsApp support in Pakistan.\n• Pay conveniently via Easypaisa or order directly on WhatsApp Business.`,
    shortDescription: 'Official ChatGPT Pro access featuring GPT-4o, advanced reasoning models, priority speeds, and unlimited generation.',
    images: ['/assets/products/chatgpt-pro.svg'],
    pricePKR: 4000,
    compareAtPricePKR: 6000,
    currency: 'PKR',
    tags: ['AI', 'ChatGPT', 'GPT-4o', 'OpenAI', 'Software', 'chatgpt pro price in pakistan', 'buy chatgpt pakistan'],
    features: [
      'Full Access to GPT-4o & Advanced Reasoning Models',
      'Peak-Time Priority Bandwidth & Lightning-Fast Output',
      'Unlimited DALL-E 3 Image Generation & Editing',
      'Advanced Data Analysis, Python Sandbox & Code Canvas',
      'Direct WhatsApp Credentials Delivery within Minutes'
    ],
    productType: 'software',
    deliveryType: 'Direct WhatsApp & Email Credentials Delivery',
    validity: '1 Month Official Renewal Access',
    licensingNotes: 'Official private login access. Full warranty for billing cycle.',
    featured: true,
    status: 'published',
    language: 'English, Urdu & Multilingual',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // 2. Gemini Pro
  {
    id: 'prod-gemini-pro',
    title: 'Gemini Pro',
    slug: 'gemini-pro',
    category: 'AI Software',
    description: `Supercharge your productivity with Google Gemini Pro. Harness Google's state-of-the-art multimodal AI model equipped with an enormous 1 Million+ token context window, deep document understanding, creative synthesis, and direct Google Workspace integration at an affordable PKR price.\n\n• Seamless document, PDF, and spreadsheet analysis.\n• Ultra-fast multimodal reasoning and code generation.\n• Order directly via WhatsApp (+923107759274) or pay via Easypaisa.`,
    shortDescription: 'Google Gemini Pro subscription with 1M+ token context window, multimodal reasoning, and workspace integration.',
    images: ['/assets/products/gemini-pro.svg'],
    pricePKR: 999,
    compareAtPricePKR: 2000,
    currency: 'PKR',
    tags: ['Gemini', 'Google AI', 'AI Assistant', 'Productivity', 'Software', 'gemini pro price in pakistan', 'buy gemini pro'],
    features: [
      'Massive 1M+ Token Context Window for Large Books & Docs',
      'Next-Gen Multimodal Vision, Audio & Code Understanding',
      'Google Workspace, Docs & Drive Synergy',
      'High-Speed Creative Writing & Coding Assistance',
      'Immediate Delivery on WhatsApp (+92 310 7759274)'
    ],
    productType: 'software',
    deliveryType: 'Direct WhatsApp & Email Activation',
    validity: '1 Month Subscription',
    licensingNotes: 'Genuine subscriber access with replacement warranty.',
    featured: true,
    status: 'published',
    language: 'English, Urdu & 40+ Languages',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // 3. WhatsApp Bulk SMS Sender Software (Streamlined 5-image showcase with direct admin upload)
  {
    id: 'prod-whatsapp-bulk-sender',
    title: 'WhatsApp Bulk SMS Sender Software',
    slug: 'whatsapp-bulk-sms-sender-software',
    category: 'Marketing Tools',
    description: `Pakistan's top-rated WhatsApp Marketing Software for Windows PC. Connect directly with thousands of potential customers on WhatsApp with zero per-message cost.\n\nBuilt for online stores, digital agencies, freelancers, educational institutes, and real estate consultants across Pakistan. Features an anti-ban intelligent delay algorithm, Excel/CSV contact list importer, group participant extractor, dynamic personalized tags, automated keyword auto-replies, and rich media message dispatch.\n\n• One-time payment of Rs. 2,499 PKR.\n• Full Windows 10 & 11 compatibility.\n• Video installation guide and WhatsApp activation.\n• Includes customizable 5-picture showcase gallery.`,
    shortDescription: 'Complete Windows bulk WhatsApp marketing software with Excel contact import, anti-ban delay, group extractor, and auto-reply bot.',
    images: ['/assets/products/whatsapp-bulk-sender.svg'],
    pricePKR: 2499,
    compareAtPricePKR: 5000,
    currency: 'PKR',
    tags: ['WhatsApp', 'Marketing', 'Bulk SMS', 'Automation', 'Tools', 'whatsapp marketing software pakistan', 'whatsapp bulk sender buy'],
    features: [
      '5 Core Visual Showcase Features with Admin Upload Support',
      'Unlimited Contact List Import via Excel (.xlsx) and CSV Files',
      'Anti-Ban Speed Delays & Safe Random Interval Controls',
      'Instant WhatsApp Group Member Grabber & Exporter',
      'Attach Images, Videos, PDF Catalogs, Audio & Documents',
      'Keyword-Based 24/7 Automated Customer Reply Bot',
      'Lifetime Windows PC License with Video Installation Guide'
    ],
    productType: 'tool',
    deliveryType: 'Instant Software Download Link + License Key via WhatsApp',
    validity: 'Lifetime Windows License & Updates',
    licensingNotes: 'Single PC activation license with full video walkthrough and WhatsApp setup support.',
    featured: true,
    status: 'published',
    language: 'English & Urdu Interface Support',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    featureSlides: [
      {
        id: 'slide-01',
        title: 'Feature 01: Automated Excel & CSV Contact Import',
        description: 'Upload thousands of Pakistani customer mobile numbers in seconds directly from Excel sheets or CSV spreadsheets with column auto-mapping.',
        imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&auto=format&fit=crop&q=80'
      },
      {
        id: 'slide-02',
        title: 'Feature 02: Dynamic Personalized Tags ({Name}, {City})',
        description: 'Personalize every outgoing message by recipient name, custom balance, city, or order number to achieve 5x higher customer response rates.',
        imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&auto=format&fit=crop&q=80'
      },
      {
        id: 'slide-03',
        title: 'Feature 03: Anti-Ban Intelligent Delay Configuration',
        description: 'Customizable random interval timers (e.g. 5–15 seconds delay between chats) with simulated human pauses to safeguard your WhatsApp accounts.',
        imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=900&auto=format&fit=crop&q=80'
      },
      {
        id: 'slide-04',
        title: 'Feature 04: Group Number Grabber & Media Attachments',
        description: 'Extract group participants and attach high-resolution product photos, sales video reels, PDF brochures, rate lists, and voice notes.',
        imageUrl: 'https://images.unsplash.com/photo-1611746872915-64382b5c76da?w=900&auto=format&fit=crop&q=80'
      },
      {
        id: 'slide-05',
        title: 'Feature 05: Real-Time Live Broadcast Delivery Tracker',
        description: 'Visual progress bar displaying live message delivery counts, successes, skips, and full Excel audit logs in real-time.',
        imageUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=900&auto=format&fit=crop&q=80'
      }
    ]
  },

  // 4. CapCut Pro
  {
    id: 'prod-capcut-pro',
    title: 'CapCut Pro',
    slug: 'capcut-pro',
    category: 'Video Editing Software',
    description: `Upgrade your video editing with official CapCut Pro individual account access in Pakistan. Unlock all VIP transitions, auto-velocity effects, AI auto-captions, vocal isolators, body effects, chroma key, and 4K 60FPS high-bitrate export without watermarks.\n\n• Works seamlessly across Windows PC, iPhone, iPad, and Android.\n• Instant setup credentials and direct WhatsApp delivery.\n• Pay easily via Easypaisa or order directly on WhatsApp.`,
    shortDescription: 'CapCut Pro individual account access with all VIP transitions, AI auto-captions, 4K 60fps export, and cloud storage.',
    images: ['/assets/products/capcut-pro.svg'],
    pricePKR: 750,
    compareAtPricePKR: 1500,
    currency: 'PKR',
    tags: ['CapCut', 'Video Editing', 'Reels', 'TikTok', 'Software', 'capcut pro buy pakistan', 'capcut pro apk buy'],
    features: [
      'Unlock All Pro VIP Filters, Transitions & AI Body Effects',
      'AI Auto-Captions with Multi-Language Speech Recognition',
      '4K Ultra HD 60FPS Video Export Without Watermarks',
      'Smart Background Removal, Motion Blur & Audio Noise Reducer',
      'Immediate Delivery on WhatsApp (+92 310 7759274)'
    ],
    productType: 'software',
    deliveryType: 'Direct WhatsApp Login Credentials & Setup Guide',
    validity: '1 Month Pro Access',
    licensingNotes: 'Genuine subscriber credentials with instant WhatsApp replacement warranty.',
    featured: true,
    status: 'published',
    language: 'English & Urdu Interface',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // 5. CapCut Pro Team Access by 6 Members
  {
    id: 'prod-capcut-pro-team',
    title: 'CapCut Pro Team Access by 6 Members',
    slug: 'capcut-pro-team-access-6-members',
    category: 'Team License Software',
    description: `The most cost-effective solution for media agencies, editing studios, and content teams in Pakistan. Gives you 6 full CapCut Pro team seats with shared project spaces, centralized cloud storage, and premium VIP capabilities unlocked for all 6 members simultaneously.\n\n• Add 6 team member email accounts into your collaborative team space.\n• Enjoy all CapCut Pro features on PC, Mac, Android, and iPhone.\n• Direct WhatsApp delivery and setup coordination.`,
    shortDescription: 'CapCut Pro multi-seat team space for up to 6 members. Shared collaborative projects, cloud storage, and pro features across all 6 seats.',
    images: [
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80'
    ],
    pricePKR: 1499,
    compareAtPricePKR: 3500,
    currency: 'PKR',
    tags: ['CapCut', 'Team License', 'Agency', 'Video Production', 'Software', 'capcut team 6 members', 'capcut agency account'],
    features: [
      '6 Dedicated Pro Member Seats for Your Agency or Team',
      'Full CapCut Pro VIP Features Unlocked for Every Member',
      'Shared Team Cloud Storage & Seamless Collaborative Editing',
      'Cross-Platform: Windows, Mac, iPad, iPhone & Android',
      'Instant Onboarding & Support on WhatsApp (+92 310 7759274)'
    ],
    productType: 'software',
    deliveryType: 'Official Team Invite Links Dispatched via WhatsApp',
    validity: '1 Month Shared Team Space',
    licensingNotes: 'Official multi-user team space with full renewal support.',
    featured: true,
    status: 'published',
    language: 'English & Urdu',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // 6. ElevenLabs 1 Lakh Credits
  {
    id: 'prod-elevenlabs-credits',
    title: 'ElevenLabs 1 Lakh Credits',
    slug: 'elevenlabs-1-lakh-credits',
    category: 'AI Voice & Audio Software',
    description: `Generate realistic, ultra-natural AI voices with ElevenLabs. This package includes 100,000 (1 Lakh) characters of voice generation credits, ideal for YouTube automation, TikTok narration, documentary channels, audiobooks, and commercial advertising.\n\n• Emotional depth, accurate human pacing, and voice cloning capabilities.\n• Instant credit-loaded account delivered straight to your WhatsApp.\n• Lowest PKR rate in Pakistan with manual Easypaisa or WhatsApp order.`,
    shortDescription: '100,000 (1 Lakh) ElevenLabs voice credits for ultra-realistic AI voiceovers, voice cloning, and YouTube automation.',
    images: [
      'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80'
    ],
    pricePKR: 500,
    compareAtPricePKR: 1200,
    currency: 'PKR',
    tags: ['ElevenLabs', 'AI Voice', 'Text to Speech', 'Audio', 'Software', 'elevenlabs pakistan', 'buy elevenlabs credits'],
    features: [
      '100,000 (1 Lakh) Text-to-Speech Voice Generation Characters',
      'Access to All Premium Natural AI Voices & Regional Accents',
      'Full Commercial Usage Rights for YouTube, Ads & Social Media',
      'Instant Account Credentials Delivered via WhatsApp',
      'Manual Easypaisa or Direct WhatsApp Business Ordering'
    ],
    productType: 'software',
    deliveryType: 'Direct Account Access & Instructions via WhatsApp',
    validity: '1 Lakh Character Balance',
    licensingNotes: 'Ready-to-use account with preloaded character credits.',
    featured: true,
    status: 'published',
    language: 'English, Urdu, Hindi & 29+ Languages',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // 7. Microsoft 365 12 Month Plan (Updated Price: 1,174 PKR)
  {
    id: 'prod-microsoft-365',
    title: 'Microsoft 365 12 Month Plan',
    slug: 'microsoft-365-12-month-plan',
    category: 'Office & Productivity Software',
    description: `Equip your devices with genuine Microsoft 365 apps for a full 12 months (1 Year). Includes official desktop versions of Word, Excel, PowerPoint, Outlook, OneNote, along with 1TB (1000 GB) of secure cloud backup storage on Microsoft OneDrive.\n\n• Works across up to 5 devices simultaneously (PC, Mac, iPhone, Android).\n• Genuine subscription account with self password reset capability.\n• Instant delivery on WhatsApp (+923107759274).`,
    shortDescription: 'Full 12-month Microsoft 365 subscription with 1TB OneDrive cloud storage, Word, Excel, PowerPoint, and 5 devices access.',
    images: ['/assets/products/microsoft-365.svg'],
    pricePKR: 1174,
    compareAtPricePKR: 2800,
    currency: 'PKR',
    tags: ['Microsoft 365', 'Office', 'OneDrive', 'Excel', 'Word', 'Software', 'microsoft 365 price pakistan', '1tb onedrive buy pakistan'],
    features: [
      'Full 12-Month (1 Year) Genuine Microsoft Subscription',
      'Word, Excel, PowerPoint, Outlook & OneNote Desktop Apps',
      '1TB (1000 GB) Private OneDrive Cloud Backup Storage',
      'Simultaneous Installation on up to 5 PCs, Macs, or Phones',
      'Direct WhatsApp Credentials Delivery with Step-by-Step Setup'
    ],
    productType: 'software',
    deliveryType: 'Official Microsoft 365 Account Credentials via WhatsApp',
    validity: '12 Months (1 Year) Subscription License',
    licensingNotes: 'Genuine personal Microsoft account credentials with 1-year warranty.',
    featured: true,
    status: 'published',
    language: 'English, Urdu & International',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // 8. Canva Panel 3 Years Subscription Warranty of 500 Users
  {
    id: 'prod-canva-panel-500',
    title: 'Canva Panel 3 Years Subscription Warranty of 500 Users',
    slug: 'canva-panel-500-users-3-years',
    category: 'Design & Admin Tools',
    description: `Become a Canva administrator with your own dedicated Canva Panel capable of hosting, inviting, and managing up to 500 users. Backed by a full 3-year warranty from Digital Product Pakistan.\n\nManage your agency team, studio designers, or resell Canva Pro seats to your own clients for high-margin recurring income in Pakistan. Full admin dashboard allows one-click user invites, seat reassignment, and team branding oversight.\n\n• Admin panel with 500 user seat capacity.\n• 3-Year replacement warranty.\n• Order directly via WhatsApp (+923107759274) or checkout via Easypaisa.`,
    shortDescription: 'Official Canva Administrator Panel with 3 years warranty and 500 member capacity. Resell seats or manage your entire creative team.',
    images: ['/assets/products/canva-panel.svg'],
    pricePKR: 2999,
    compareAtPricePKR: 7500,
    currency: 'PKR',
    tags: ['Canva', 'Canva Panel', 'Design', 'Reseller Tool', 'Admin Panel', 'Tools', 'canva pro panel pakistan', 'canva 500 users'],
    features: [
      'Dedicated Canva Pro Admin Panel Dashboard',
      '500 Member / User Capacity with Full Admin Controls',
      '3-Year (36 Months) Complete Replacement Warranty',
      'Generate & Resell Canva Pro Seats to Your Own Clients',
      'Immediate Delivery & Admin Guide via WhatsApp (+92 310 7759274)'
    ],
    productType: 'tool',
    deliveryType: 'Admin Dashboard Credentials & Guide Delivered via WhatsApp',
    validity: '3 Years Warranty (500 User Seats)',
    licensingNotes: 'Full Administrator Panel with 36-month replacement warranty.',
    featured: true,
    status: 'published',
    language: 'English, Urdu & Multilingual',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // 9. Notion Plus 12 Month Plan (NEW - 1,443 PKR)
  {
    id: 'prod-notion-plus-12m',
    title: 'Notion Plus 12 Month Plan',
    slug: 'notion-plus-12-month-plan',
    category: 'Productivity Software',
    description: `Upgrade your workspace with official Notion Plus for 12 months (1 Full Year). Enjoy unlimited blocks, unlimited file uploads, 30-day page version history, and invite up to 100 guests to collaborate on your databases, projects, and notes.\n\n• Perfect for freelancers, university students, and growing startup teams.\n• Genuine private workspace activation.\n• Delivered directly to your WhatsApp (+92 310 7759274) with complete setup guidance.`,
    shortDescription: 'Official 12-month Notion Plus subscription with unlimited blocks, unlimited file uploads, and collaborative team workspace.',
    images: ['/assets/products/notion-plus.svg'],
    pricePKR: 1443,
    compareAtPricePKR: 3500,
    currency: 'PKR',
    tags: ['Notion', 'Notion Plus', 'Productivity', 'Notes', 'Software', 'notion plus price in pakistan', 'buy notion plus pakistan'],
    features: [
      '12 Months (1 Year) Full Notion Plus Workspace License',
      'Unlimited Blocks for Teams & Individuals',
      'Unlimited File Upload Size (No 5MB limit)',
      '30-Day Page Version History & Collaborative Access',
      'Instant Delivery & Onboarding via WhatsApp'
    ],
    productType: 'software',
    deliveryType: 'Direct Workspace Upgrade / Invite via WhatsApp',
    validity: '12 Months (1 Year) Official Plan',
    licensingNotes: 'Genuine workspace upgrade with 12-month full warranty.',
    featured: true,
    status: 'published',
    language: 'English & Urdu Support',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // 10. HMA VPN Private Access (NEW - 402 PKR)
  {
    id: 'prod-hma-vpn',
    title: 'HMA VPN Private Access',
    slug: 'hma-vpn-private-access',
    category: 'Security & VPN Software',
    description: `Browse securely and bypass regional restrictions with HideMyAss (HMA) VPN Private Access. Access lightning-fast servers in over 190+ countries with military-grade 256-bit AES encryption, IP shuffling, and strict zero-logging protection.\n\n• Works seamlessly across Windows, Mac, iOS, Android, and Linux.\n• High-speed streaming and private browsing with dedicated speeds.\n• Instant setup credentials dispatched via WhatsApp.`,
    shortDescription: 'High-speed HMA VPN private access with 190+ country servers, AES-256 encryption, and IP shuffle protection.',
    images: ['/assets/products/hma-vpn.svg'],
    pricePKR: 402,
    compareAtPricePKR: 1000,
    currency: 'PKR',
    tags: ['VPN', 'HMA VPN', 'Privacy', 'Security', 'Software', 'hma vpn price in pakistan', 'cheap vpn buy pakistan'],
    features: [
      'Private High-Speed Access to 190+ Country Server Locations',
      'Military Grade 256-Bit AES Encryption & Zero-Log Policy',
      'Lightning-Fast Streaming & Torrent Optimization',
      'Cross-Platform: Windows, Android, iPhone, Mac',
      'Direct WhatsApp Credentials Delivery within Minutes'
    ],
    productType: 'software',
    deliveryType: 'Direct WhatsApp Login Credentials & Setup Instructions',
    validity: 'Private Access Warranty',
    licensingNotes: 'Private credentials with prompt replacement warranty.',
    featured: true,
    status: 'published',
    language: 'English & Multi-language',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // 11. Outlook Mail Trust Private (NEW - 107 PKR)
  {
    id: 'prod-outlook-mail-trust',
    title: 'Outlook Mail Trust Private',
    slug: 'outlook-mail-trust-private',
    category: 'Account & Email Software',
    description: `Get a verified, clean, and trusted private Microsoft Outlook email account with full recovery access. Ideal for freelancing profiles, business registrations, agency client outreach, or separating personal and professional workflows.\n\n• Clean IP creation with trusted reputation history.\n• Delivered with full credentials (email, password, recovery key).\n• Immediate delivery on WhatsApp (+92 310 7759274).`,
    shortDescription: 'Verified clean private Microsoft Outlook account with trusted sender reputation and full recovery credentials.',
    images: ['/assets/products/outlook-mail.svg'],
    pricePKR: 107,
    compareAtPricePKR: 300,
    currency: 'PKR',
    tags: ['Outlook', 'Microsoft Email', 'Email', 'Accounts', 'Software', 'buy outlook account pakistan', 'cheap outlook mail'],
    features: [
      '100% Private, Fresh & Clean Microsoft Outlook Account',
      'Full Ownership: Email + Password + Recovery Mail Access',
      'High Inbox Delivery Reputation for Outreach & Registrations',
      'Usable with Microsoft Webmail, Outlook App & Third-Party Clients',
      'Instant Delivery on WhatsApp (+92 310 7759274)'
    ],
    productType: 'software',
    deliveryType: 'Direct Email & Password Credentials via WhatsApp',
    validity: 'Lifetime Private Ownership',
    licensingNotes: 'Complete access handover with password changeable by customer.',
    featured: true,
    status: 'published',
    language: 'English & Global',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // 12. Super Duolingo Private Access (NEW - 512 PKR)
  {
    id: 'prod-super-duolingo',
    title: 'Super Duolingo Private Access',
    slug: 'super-duolingo-private-access',
    category: 'Learning & Language Software',
    description: `Master any language without interruptions using Super Duolingo Private Access. Enjoy unlimited hearts, practice mistakes in the personalized review hub, test out of lessons, repair streaks, and learn with completely ad-free focus.\n\n• Learn English, German, French, Spanish, Arabic, Turkish, and 40+ languages.\n• Fast activation directly on your mobile device or desktop.\n• Order directly via WhatsApp (+92 310 7759274) or pay via Easypaisa.`,
    shortDescription: 'Super Duolingo private access with unlimited hearts, ad-free lessons, personalized practice hub, and streak freeze.',
    images: ['/assets/products/super-duolingo.svg'],
    pricePKR: 512,
    compareAtPricePKR: 1200,
    currency: 'PKR',
    tags: ['Duolingo', 'Super Duolingo', 'Language Learning', 'English', 'Software', 'super duolingo price in pakistan', 'buy duolingo plus pakistan'],
    features: [
      'Unlimited Hearts — Never Wait for Hearts to Refill',
      '100% Ad-Free Learning Experience',
      'Mistakes Review Hub with Targeted Grammar Practice',
      'Unlimited Skill Level Test-Outs & Progress Quizzes',
      'Instant Delivery on WhatsApp (+92 310 7759274)'
    ],
    productType: 'software',
    deliveryType: 'Direct Private Access Activation Link / Invite via WhatsApp',
    validity: 'Super Subscription Access',
    licensingNotes: 'Genuine subscriber status with replacement guarantee.',
    featured: true,
    status: 'published',
    language: 'English, Urdu, German, French & 40+ Languages',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export const INITIAL_BLOG_POSTS: BlogPost[] = COMPREHENSIVE_BLOG_ARTICLES;
