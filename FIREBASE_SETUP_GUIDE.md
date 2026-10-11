# Firebase Configuration & Security Guide — Digital Product Pakistan

This document outlines the Firebase architecture, security rules, and administrator bootstrapping for Digital Product Pakistan.

---

## 1. Firebase Provisioning Summary
- **Project ID**: `gen-lang-client-0702146343`
- **Firestore Database ID**: `ai-studio-6e2088ca-e47b-447d-92d1-610fdb75302a`
- **Storage Bucket**: `gen-lang-client-0702146343.firebasestorage.app`
- **Master Admin Email**: `sahabsandhu455@gmail.com`

---

## 2. Collections & Schema Architecture

### `products`
- Public read access for documents with `status == 'published'`.
- Restricted create, update, delete permissions for verified administrators only.
- Fields: `title`, `slug`, `category`, `productType` (`ebook`, `software`, `course`), `pricePKR` (integer), `status` (`published`, `draft`, `archived`), `images`, `features`, `licensingNotes`.

### `orders`
- Created by guest customers with initial status:
  - `paymentStatus`: `"Payment Proof Submitted"`
  - `orderStatus`: `"Pending Verification"`
  - `deliveryStatus`: `"Awaiting Payment"`
- Security rules strictly prevent clients from changing `paymentStatus` to `"Payment Confirmed"` or modifying other customer orders.
- Full inspection and update permissions restricted to administrators.

### `blogPosts`
- Public read for `status == 'published'`.
- CRUD restricted to administrators.

### `storeSettings`
- Public read for global store configuration (business name, WhatsApp contact, Easypaisa details).
- Write access restricted to administrators.

### `admins`
- Role-based access control (RBAC). Document IDs match admin Firebase Auth `uid`.

---

## 3. Security Rules (`firestore.rules`)
Deployed automatically via AI Studio and Firebase CLI:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if false;
    }

    function incoming() { return request.resource.data; }
    function isSignedIn() { return request.auth != null; }
    function isValidId(id) { return id is string && id.size() <= 128 && id.matches('^[a-zA-Z0-9_\\-]+$'); }

    function isAdmin() {
      return isSignedIn() && (
        request.auth.token.email == 'sahabsandhu455@gmail.com' ||
        exists(/databases/$(database)/documents/admins/$(request.auth.uid))
      );
    }

    // Products: public reads published, admin manages
    match /products/{productId} {
      allow get, list: if resource.data.status == 'published' || isAdmin();
      allow create, update, delete: if isAdmin();
    }

    // Orders: customers create initial proof, admin reviews & verifies
    match /orders/{orderId} {
      allow get: if isValidId(orderId);
      allow list: if isAdmin();
      allow create: if isValidId(orderId) && incoming().orderStatus == 'Pending Verification';
      allow update, delete: if isAdmin();
    }

    // Blog: public reads published, admin writes
    match /blogPosts/{postId} {
      allow get, list: if resource.data.status == 'published' || isAdmin();
      allow create, update, delete: if isAdmin();
    }

    // Settings
    match /storeSettings/{settingId} {
      allow get, list: if true;
      allow write: if isAdmin();
    }

    // Admins
    match /admins/{adminId} {
      allow read, write: if isAdmin();
    }
  }
}
```

---

## 4. Cloud Storage Rules (`storage.rules`)
Payment screenshot proofs are strictly private:
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    function isSignedIn() { return request.auth != null; }
    function isAdmin() { return isSignedIn() && request.auth.token.email == 'sahabsandhu455@gmail.com'; }

    // Private payment screenshot uploads
    match /payment-proofs/{orderId}/{fileName} {
      allow read: if isAdmin();
      allow write: if request.resource.size <= 5 * 1024 * 1024
                   && request.resource.contentType.matches('image/.*');
    }

    // Public store assets
    match /public/{allPaths=**} {
      allow read: if true;
      allow write: if isAdmin();
    }
  }
}
```

---

## 5. Setting up Admin User Credentials

### Option A: Instant Access via Google Sign-In (Recommended & Enabled by Default)
By default, the Firebase project is pre-configured with Google Authentication:
1. Navigate to `/admin`.
2. Click **"Sign in with Google (Instant Admin Login)"**.
3. Select your admin Google Account (`sahabsandhu455@gmail.com`).
4. You will be authenticated immediately as the Super Administrator without password setup or permission errors.

### Option B: Enabling Email/Password Authentication (Resolves `auth/operation-not-allowed`)
If you prefer traditional email and password login instead of Google Sign-In:
1. Open your [Firebase Console](https://console.firebase.google.com/project/gen-lang-client-0702146343/authentication/providers).
2. Go to **Authentication** > **Sign-in method**.
3. Click **Add new provider** (or select **Email/Password**).
4. Toggle **Enable** next to Email/Password (leave Email link/passwordless off).
5. Click **Save**.
6. Return to `/admin`, enter your email and password, and click **"First time? Setup / Initialize Admin"**.

---

## 6. Pre-Configured Store & Easypaisa Details
- **Account Title**: `MUHAMMAD KUMAIL ALI`
- **Account Number**: `03010333544`
- **WhatsApp Support**: `+923107759274`
- **Currency**: `PKR`
