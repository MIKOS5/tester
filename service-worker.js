const CACHE_NAME = "obvyris-v1";

// Cache only real files (NO folders)
const FILES = [
  "./index99.html",
  "./manifest.json",
  "./R192.png",
  "./R512.png",
  "./Video_Obvyris.html",
  "./Radio_Obvyris.html"
];

// INSTALL
self.addEventListener("install", event => {
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(FILES);
    })
  );
});

// ACTIVATE
self.addEventListener("activate", event => {
  event.waitUntil(
    clients.claim()
  );
});

// FETCH (cache-first fallback)
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;

      return fetch(event.request)
        .then(network => {
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, network.clone());
            return network;
          });
        })
        .catch(() => {
          // offline fallback (optional)
          return caches.match("./index99.html");
        });
    })
  );
});
