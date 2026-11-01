const CACHE_NAME = 'dpp-cache-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/assets/products/chatgpt-pro.svg',
  '/assets/products/gemini-pro.svg',
  '/assets/products/whatsapp-bulk-sender.svg',
  '/assets/products/capcut-pro.svg',
  '/assets/products/capcut-team.svg',
  '/assets/products/elevenlabs.svg',
  '/assets/products/microsoft-365.svg',
  '/assets/products/canva-panel.svg',
  '/assets/products/notion-plus.svg',
  '/assets/products/hma-vpn.svg',
  '/assets/products/outlook-mail.svg',
  '/assets/products/super-duolingo.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch(() => {});
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);

  // Cache static assets and SVGs with cache-first strategy
  if (url.origin === self.location.origin && (url.pathname.startsWith('/assets/') || url.pathname.endsWith('.svg'))) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) return cachedResponse;
        return fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return networkResponse;
        });
      })
    );
    return;
  }

  // Network-first for other requests
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
