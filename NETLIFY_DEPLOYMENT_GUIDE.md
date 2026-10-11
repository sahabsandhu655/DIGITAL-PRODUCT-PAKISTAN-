# Netlify Deployment & Custom Domain Guide — Digital Product Pakistan

This guide walks you through deploying **Digital Product Pakistan** to Netlify and connecting your custom domain.

---

## 1. Architecture Overview
- **Frontend**: Vite + React 19 + TypeScript + Tailwind CSS v4
- **Backend & Database**: Firebase Cloud Firestore, Firebase Authentication, Cloud Storage
- **Hosting & CDN**: Netlify
- **Serverless API**: Netlify Functions in `netlify/functions/` (`create-order.ts`, `upload-proof.ts`, `ai-assistant.ts`)
- **Routing**: Client-side SPA fallback configured in `_redirects` and `netlify.toml`

---

## 2. Netlify Build Configuration
The repository includes pre-configured deployment files:
- **`netlify.toml`**:
  ```toml
  [build]
    command = "npm run build"
    publish = "dist"
    functions = "netlify/functions"

  [[redirects]]
    from = "/api/create-order"
    to = "/.netlify/functions/create-order"
    status = 200

  [[redirects]]
    from = "/api/upload-proof"
    to = "/.netlify/functions/upload-proof"
    status = 200

  [[redirects]]
    from = "/api/ai-assistant"
    to = "/.netlify/functions/ai-assistant"
    status = 200

  [[redirects]]
    from = "/*"
    to = "/index.html"
    status = 200
  ```
- **`public/_redirects`**:
  ```
  /*    /index.html   200
  ```

---

## 3. Deployment Steps via GitHub / Git Repository

### Step 1: Push Repository to GitHub / GitLab
Push your project files to your Git repository:
```bash
git init
git add .
git commit -m "Initial commit for Digital Product Pakistan"
git remote add origin https://github.com/your-username/digital-product-pakistan.git
git push -u origin main
```

### Step 2: Import into Netlify
1. Log in to [Netlify](https://app.netlify.com/).
2. Click **"Add new site"** > **"Import an existing project"**.
3. Select **GitHub** and choose the `digital-product-pakistan` repository.
4. Verify the build settings:
   - **Base directory**: `.` (leave blank or root)
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Functions directory**: `netlify/functions`

### Step 3: Configure Environment Variables in Netlify
Go to **Site configuration** > **Environment variables** > **Add variable**:
- `NODE_VERSION`: `20`
- `GEMINI_API_KEY`: *(Optional)* Your Gemini API key for AI assistant features in the admin dashboard.
- Firebase client configuration is bundled safely via `firebase-applet-config.json` (no private service account keys are exposed).

### Step 4: Click "Deploy Site"
Netlify will execute `npm run build`, bundle the Vite app into `dist/`, build serverless functions, and assign your site a live URL (e.g. `https://digital-product-pakistan.netlify.app`).

---

## 4. Connecting Your Custom Domain on Netlify

### Step 1: Add Custom Domain in Netlify
1. In your Netlify Site dashboard, go to **Domain management** > **Domains**.
2. Click **"Add domain alias"** or **"Add a domain"**.
3. Enter your domain (e.g. `digitalproductpakistan.com` or `digitalproduct.pk`).
4. Click **Verify** and confirm domain ownership.

### Step 2: Update DNS Records with Your Domain Registrar
At your domain registrar (GoDaddy, Namecheap, PKNIC, etc.), configure DNS:
- **Apex Domain (`digitalproductpakistan.com`)**:
  - Point the **A Record** (`@`) to Netlify's load balancer IP: `75.2.60.5`
- **Subdomain (`www.digitalproductpakistan.com`)**:
  - Point the **CNAME Record** (`www`) to `<your-site-name>.netlify.app`

### Step 3: Automatic HTTPS & SSL Certificate
Netlify will automatically provision a free Let's Encrypt SSL certificate within a few minutes after DNS propagation.

---

## 5. Verification Checklist Post-Deployment
- [ ] Homepage loads cleanly with charcoal/electric lime theme.
- [ ] Product catalog and filters work on mobile and desktop.
- [ ] Product pages (`/product/:slug`) and blog pages (`/blog/:slug`) reload without 404 errors.
- [ ] Guest checkout works: enter customer details, copy Easypaisa account number, upload screenshot proof, and submit.
- [ ] Confirmation screen shows unique Order ID and "Send Order Details on WhatsApp" link.
- [ ] Administrator signs in at `/admin`, views uploaded payment screenshot, verifies payment, and updates order status.
