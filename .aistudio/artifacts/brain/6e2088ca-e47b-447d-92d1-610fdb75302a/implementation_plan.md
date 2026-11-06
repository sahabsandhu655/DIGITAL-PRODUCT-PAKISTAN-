# Implementation Plan: Catalog Expansion & Price Updates

Add 9 new in-demand digital products and update prices across 7 existing products as requested by the store owner, keeping all previous catalog products intact and generating custom SVG logo artwork for every new item.

---

## 1. Catalog Updates & New Products Breakdown

### A. Price Updates on Existing Products
* **Microsoft 365 12 Month Plan**: Update from 1,174 PKR $\to$ **1,199 PKR**
* **Adobe Express 12 Months**: Update from 1,950 PKR $\to$ **676 PKR**
* **Canva Admin Panel (500 Users | 3 Years Warranty)**: Update from 4,000 PKR $\to$ **3,999 PKR**
* **Notion Plus 12 Months**: Update from 1,443 PKR $\to$ **1,599 PKR**
* **Super Duolingo**: Update from 512 PKR $\to$ **562 PKR**
* **WhatsApp Bulk SMS Sender Software**: Update from 2,499 PKR $\to$ **1,999 PKR**
* **HMA VPN (1 Month Private)**: Update from 402 PKR $\to$ **500 PKR**

### B. New Products to Add (with Custom SVGs)
1. **Canva Pro (On Mail)**: **500 PKR** (Design & Graphics, Personal Mail Upgrade)
2. **Coursera Private Plan (Private Mail)**: **4,500 PKR** (4 Months Full Warranty)
3. **LinkedIn Career (3 Months)**: **752 PKR** (Professional Networking & InMail)
4. **LinkedIn Sales Navigator (2 Months)**: **1,384 PKR** (Lead Generation & Advanced Search)
5. **Udemy Personal Plan (1 Month)**: **1,199 PKR** (8,000+ On-Demand Video Courses)
6. **Claude API $500 Credit Balance (30 Days FW)**: **3,934 PKR** (Anthropic Claude 3.5 Sonnet / Opus Access)
7. **OWL Proxy 200MB Residential Bandwidth**: **124 PKR** (Clean Residential Rotating IPs)
8. **Windows 10/11 Pro Genuine Lifetime License**: **650 PKR** (Digital Activation Key)
9. **Proton VPN Private Plan (1 Month)**: **500 PKR** (Swiss Zero-Log Dedicated Privacy)

*(All existing products including ChatGPT Pro, Gemini Pro, CapCut, ElevenLabs, Netflix, Amazon Prime, and Course Pro remain active in the catalog).*

---

## 2. Technical Architecture & Component Changes

### A. Vector Artwork (`/public/assets/products/`)
Generate 9 custom high-contrast SVG vector badges matching the dark-theme aesthetic (`#111C18` background, neon accents, crisp typography, and high-definition icons):
* `canva-pro-mail.svg`
* `coursera-private.svg`
* `linkedin-career.svg`
* `linkedin-sales-nav.svg`
* `udemy-personal.svg`
* `claude-api.svg`
* `owl-proxy.svg`
* `windows-pro.svg`
* `proton-vpn.svg`
* `adobe-express.svg`

### B. Core Data Layer (`src/data/seedData.ts` & `src/data/liveProducts.json`)
* Update the 7 existing item definitions in `INITIAL_PRODUCTS`.
* Append the 9 new product objects with comprehensive Pakistani delivery terms, validity details, tags, and features.
* Re-sync `liveProducts.json` so the `/api/products` server endpoint immediately serves the new catalog.
* Update `storeService.ts` local cache migration to ensure existing client sessions inherit the new prices without manual cache clearing.

### C. AI Chatbot (`src/components/CustomerChatbot.tsx`)
* Extend `matchSpecificProduct` with keywords for LinkedIn, Coursera, Udemy, Claude API, Windows Pro, OWL Proxy, and Proton VPN.
* Ensure live inventory pricing lookup automatically quotes the revised prices (e.g., WhatsApp SMS Sender at 1,999 PKR, Adobe Express at 676 PKR).

### D. SEO & Structured Data (`index.html`)
* Update `FAQPage` and `ItemList` Schema.org JSON-LD nodes to reflect the latest prices and new software tools.
* Add search keywords for Pakistani digital buyers (e.g. *buy linkedin sales navigator pakistan*, *coursera plus pakistan easypaisa*, *claude api credits pakistan*).

---

## 3. Verification & Testing

* **Build & Type Check**: Execute `tsc --noEmit` and `compile_applet`.
* **API Validation**: Verify `GET /api/products` returns all 27 products with correct prices.
* **Frontend Verification**: Verify product display in Home, Software, Tools, and Cart drawer with Easypaisa checkout calculation.
* **Admin Dashboard Check**: Confirm all new products are editable and searchable in the Admin catalog.
