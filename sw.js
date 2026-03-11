const CACHE_NAME = 'xchg-v7';
const STATIC_ASSETS = [
  '/currency-converter/',
  '/currency-converter/index.html',
  '/currency-converter/manifest.json',
  '/currency-converter/fonts/space-mono-400.woff2',
  '/currency-converter/fonts/space-mono-700.woff2',
  '/currency-converter/fonts/outfit-400.woff2',
  '/currency-converter/Gi%C3%A1.svg',
];

// Install: cache static shell (individual puts so one failure doesn't break all)
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      Promise.all(STATIC_ASSETS.map(url =>
        fetch(url).then(res => cache.put(url, res)).catch(() => {})
      ))
    )
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
