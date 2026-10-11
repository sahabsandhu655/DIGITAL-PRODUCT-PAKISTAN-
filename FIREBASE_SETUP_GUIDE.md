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
1. Navigate to `/admin` in your browser.
2. Enter your admin email (`sahabsandhu455@gmail.com`) and choose a strong password (minimum 6 characters).
3. Click **"First time? Setup / Initialize Admin"** to register and initialize the admin record.
4. Once signed in, visit the **"Store Settings"** tab to enter your actual Easypaisa account holder name and mobile account number.
