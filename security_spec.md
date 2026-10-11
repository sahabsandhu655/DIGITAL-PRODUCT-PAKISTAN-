# Security Specification — Digital Product Pakistan

## 1. Data Invariants
1. **Public Catalog Isolation**: Visitors can only read products and blog posts with status == 'published'. Drafts and archives are restricted to administrators.
2. **Order Tamper Proofing**: Customers can create an initial order with status "Pending Verification" and paymentStatus "Payment Proof Submitted" or "Awaiting Payment". Customers CANNOT update orders, mark payments as confirmed, or change delivery status.
3. **Admin Privilege Isolation**: Only verified administrators can create/modify products, change prices, update store settings, inspect payment proofs, confirm orders, and publish blogs.
4. **PII and Payment Proof Privacy**: Order records containing customer WhatsApp, phone numbers, and payment proof screenshots are protected and only readable/updatable by administrators or the customer query with specific matching ID.
5. **Admin Bootstrapping**: Administrator access requires authentication matching the designated business admin email (`sahabsandhu455@gmail.com`) or inclusion in the `/admins` collection.

## 2. The "Dirty Dozen" Threat Vectors
1. Client payload setting `paymentStatus: 'Payment Confirmed'` during checkout creation. -> REJECTED.
2. Client payload setting `orderStatus: 'Completed'` or `deliveryStatus: 'Delivered'` during order creation. -> REJECTED.
3. Unauthenticated or non-admin visitor updating product price from 2500 PKR to 0 PKR. -> REJECTED.
4. Non-admin visitor creating a new product or draft. -> REJECTED.
5. Non-admin reading unpublished draft blog posts or draft software products. -> REJECTED.
6. Non-admin listing all orders and customer phone numbers. -> REJECTED.
7. Customer attempting to delete their order or another customer's order. -> REJECTED.
8. Injection of arbitrary oversized JSON blobs (>1MB) into product or order collections. -> REJECTED.
9. Modifying store Easypaisa phone number without admin authentication. -> REJECTED.
10. Spoofing admin privileges by passing unverified client tokens. -> REJECTED.
11. Updating immutable fields `createdAt` or `orderNumber` after creation. -> REJECTED.
12. Deleting admin records or elevating normal user accounts to admin. -> REJECTED.
