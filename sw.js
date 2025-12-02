const CACHE_NAME = 'work-images-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Prefetch images when the page sends URLs
self.addEventListener('message', (event) => {
  const { type, urls } = event.data || {};
  if (type === 'PREFETCH_IMAGES' && Array.isArray(urls)) {
    event.waitUntil(
      caches.open(CACHE_NAME).then(async (cache) => {
        for (const url of urls) {
          const req = new Request(url, { mode: 'no-cors', cache: 'reload' });
          const hit = await cache.match(req);
          if (!hit) {
            try {
              const res = await fetch(req);
              // Cache opaque or normal responses
              if (res && (res.ok || res.type === 'opaque')) {
                await cache.put(req, res.clone());
              }
            } catch (e) {
              // ignore failures
            }
          }
        }
      })
    );
  }
});

// Cache-first for images
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const isImage = req.destination === 'image' || /\.(png|jpg|jpeg|gif|webp|svg)(\?|$)/i.test(new URL(req.url).pathname);
  if (!isImage) return;
  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cached = await cache.match(req, { ignoreSearch: false });
      if (cached) return cached;
      try {
        const fetched = await fetch(req);
        if (fetched && (fetched.ok || fetched.type === 'opaque')) {
          cache.put(req, fetched.clone());
        }
        return fetched;
      } catch (e) {
        return fetch(req);
      }
    })
  );
});
