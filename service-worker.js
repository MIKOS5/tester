const CACHE_NAME = "obvyris-v1";

const FILES = [
  "./index99.html",
  "./manifest.json",
  "./R192.png",
  "./R512.png"
];

// INSTALL
self.addEventListener("install", event => {
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES))
  );
});

// ACTIVATE
self.addEventListener("activate", event => {
  event.waitUntil(clients.claim());
});

// FETCH (safe fallback)
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(res => {
      return res || fetch(event.request);
    })
  );
});
