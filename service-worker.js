const CACHE_NAME = "obvyris-pro-v1";

// IMPORTANT: use full /tester/ paths for GitHub Pages stability
const FILES = [
  "/tester/",
  "/tester/index99.html",
  "/tester/manifest.json",
  "/tester/R192.png",
  "/tester/R512.png"
];

// INSTALL
self.addEventListener("install", event => {
  self.skipWaiting(); // forces new SW to activate immediately

  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(FILES);
    })
  );
});

// ACTIVATE
self.addEventListener("activate", event => {
  event.waitUntil(
    clients.claim() // forces control of pages immediately
  );
});

// FETCH (cache-first with network fallback)
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;

      return fetch(event.request).then(networkResponse => {
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      }).catch(() => {
        // optional offline fallback could go here
      });
    })
  );
});
