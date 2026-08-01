const CACHE_NAME = "obvyris-v2";

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

  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    ).then(() => clients.claim())
  );

});

// FETCH
self.addEventListener("fetch", event => {

  // Never cache Google Apps Script APIs
  if (event.request.url.includes("script.google.com")) {
    event.respondWith(fetch(event.request));
    return;
  }

  event.respondWith(

    fetch(event.request)

      .then(response => {

        if (
          event.request.method === "GET" &&
          response.status === 200
        ) {

          const copy = response.clone();

          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, copy);
          });

        }

        return response;

      })

      .catch(() => {

        return caches.match(event.request);

      })

  );

});
