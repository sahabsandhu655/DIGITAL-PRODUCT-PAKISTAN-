# Vercel Deployment & Custom Domain Guide: www.digitalproductpakistan.net

This guide explains how to deploy **Digital Product Pakistan** to **[Vercel](https://vercel.com)** and fix the custom domain connection for **`www.digitalproductpakistan.net`**.

---

## 🚨 Why `www.digitalproductpakistan.net` Is Not Working

When querying Google Global DNS (`dns.google`) for `digitalproductpakistan.net`, the response is **`Status: 3 (NXDOMAIN)`**.

**NXDOMAIN means Non-Existent Domain.** This happens for one of these reasons:

1. **The Domain Has Not Been Purchased Yet:**
   Simply entering a domain in Vercel or code does **not** register it. You must first purchase `digitalproductpakistan.net` on a domain registrar such as [Namecheap](https://www.namecheap.com), [GoDaddy](https://www.godaddy.com), [Hostinger](https://www.hostinger.com), or [PKNIC](https://www.pknic.net.pk).

2. **Spelling / Extension Check:**
   Verify if you purchased `.net`, `.com`, or `.pk`:
   - `digitalproductpakistan.net`
   - `digitalproductpakistan.com`
   - `digitalproductpakistan.pk`
   If you registered `.com` instead of `.net`, use `digitalproductpakistan.com`.

3. **ICANN Email Verification Hold:**
   After buying a domain, registrars send a verification email. If unverified, the domain is put on `ClientHold` and will not work.

4. **DNS Records Not Pointed to Vercel:**
   Even after purchase, you must add the A and CNAME records pointing to Vercel.

---

## 🛠️ Step-by-Step Fix to Make `www.digitalproductpakistan.net` Work

### Step 1: Add the Domain in Vercel Dashboard
1. Log in to [vercel.com/dashboard](https://vercel.com/dashboard).
2. Click your project (`digital-product-pakistan`).
3. Go to **Settings** > **Domains**.
4. Type `digitalproductpakistan.net` and click **Add**.
5. Vercel will recommend adding both:
   - `digitalproductpakistan.net`
   - `www.digitalproductpakistan.net` (redirect to apex or vice versa).

---

### Step 2: Configure DNS at Your Domain Registrar (GoDaddy, Namecheap, Hostinger)
Log in to your registrar's DNS Management / Zone Editor:

1. **Delete Old Records:**
   - Remove any old Netlify A record (`104.198.14.52`) or old CNAME.
2. **Add Record 1 (Apex A Record):**
   - **Type:** `A`
   - **Name / Host:** `@` (or leave blank)
   - **Value / Target:** `76.76.21.21`
   - **TTL:** `Automatic` or `3600`
3. **Add Record 2 (WWW CNAME Record):**
   - **Type:** `CNAME`
   - **Name / Host:** `www`
   - **Value / Target:** `cname.vercel-dns.com`
   - **TTL:** `Automatic` or `3600`

> **Note for Cloudflare users:** If using Cloudflare DNS, set the Proxy status to **DNS only (Grey Cloud)** for these records so Vercel can generate the SSL certificate.

---

### Step 3: Wait for DNS Propagation & Automated SSL
DNS propagation typically takes **5 to 30 minutes**. Once propagated:
- Vercel automatically detects the records.
- Vercel automatically generates a free Let's Encrypt SSL certificate.
- Your store will be live at `https://www.digitalproductpakistan.net`!

---

## 3. How to Deploy the Project to Vercel

### Option A: Via GitHub (Recommended)
1. Push your project code to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new).
3. Select your repository.
4. Framework preset: **Vite** (Build: `npm run build`, Output: `dist`).
5. Click **Deploy**.

### Option B: Via Vercel CLI
```bash
npm i -g vercel
vercel login
vercel --prod
```
