const CACHE_NAME = 'zauntech-v19';
const urlsToCache = [
  '/',
  '/index.html',
  '/services.html',
  '/portfolio.html',
  '/about.html',
  '/faq.html',
  '/contact.html',
  '/dashboard.html',
  '/profile.html',
  '/login.html',
  '/register.html',
  '/css/style.css',
  '/js/script.js',
  '/js/firebase-loader.js',
  '/js/auth-guard.js',
  '/images/logo.svg',
  '/manifest.json'
];

// Install event - cache resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serve from cache first, then update in background (stale-while-revalidate)
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // For HTML pages, use network first for fresh content
  if (url.pathname.endsWith('.html') || url.pathname === '/') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Clone the response
          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });
          return response;
        })
        .catch(() => {
          // If network fails, try cache
          return caches.match(event.request);
        })
    );
    return;
  }

  // For CSS, JS, and images, use stale-while-revalidate
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        // Return cached version immediately
        const fetchPromise = fetch(event.request).then(networkResponse => {
          // Clone the response for cache BEFORE returning it
          const responseToCache = networkResponse.clone();
          // Update cache with fresh version, but only for GET requests
          if (event.request.method === 'GET') {
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        }).catch(() => {
          // If network fails, return cached version
          return cachedResponse;
        });

        // Return cached version immediately, then update in background
        return cachedResponse || fetchPromise;
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
