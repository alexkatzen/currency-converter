const CACHE_NAME = 'xchg-v4';
const STATIC_ASSETS = [
  '/currency-converter/',
  '/currency-converter/index.html',
  '/currency-converter/manifest.json',
  '/currency-converter/fonts/space-mono-400.woff2',
  '/currency-converter/fonts/space-mono-700.woff2',
  '/currency-converter/Giá.svg',
];

// Install: cache static shell
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: network-first for API, cache-first for assets
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // API calls → network only (no stale rates)
  if (url.hostname.includes('exchangerate-api.com')) {
    event.respondWith(
      fetch(event.request).catch(() =>
        new Response(JSON.stringify({ error: 'Offline — no cached rates available.' }), {
          headers: { 'Content-Type': 'application/json' }
        })
      )
    );
    return;
  }

  // Static assets → cache first, fallback network
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});
