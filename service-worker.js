const CACHE_NAME = "codefc-pwa-v2";
const APP_SHELL = [
  "./",
  "./index.html",
  "./payment.html",
  "./founder-payments.html",
  "./dashboard.html",
  "./style.css",
  "./script.js",
  "./manifest.json",
  "./codefc-icon-192.png",
  "./codefc-icon-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      Promise.all(
        APP_SHELL.map(path =>
          cache.add(path).catch(error =>
            console.warn("Could not cache:", path, error)
          )
        )
      )
    )
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key.startsWith("codefc-pwa-") && key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  const request = event.request;
  const url = new URL(request.url);

  if (request.method !== "GET" || url.origin !== self.location.origin) return;

  // For page navigation, try the network first so users get the latest page.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put("./index.html",
  "./payment.html",
  "./founder-payments.html",
  "./dashboard.html", copy));
          return response;
        })
        .catch(async () => {
          return (await caches.match(request))
            || (await caches.match("./index.html"))
            || Response.error();
        })
    );
    return;
  }

  // For local static files, use the cache first and update it in the background.
  event.respondWith(
    caches.match(request).then(cached => {
      const networkUpdate = fetch(request).then(response => {
        if (response && response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
        }
        return response;
      });

      return cached || networkUpdate;
    })
  );
});
