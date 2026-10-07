// Minimal service worker: makes the app installable and keeps the page shell available.
const CACHE = "civicassist-v1";

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.add("/")).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin || url.pathname.startsWith("/api/")) return;

  // Page: network first, fall back to the cached copy when offline.
  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req)
        .then((res) => {
          if (url.pathname === "/") {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put("/", copy));
          }
          return res;
        })
        .catch(() => caches.match("/"))
    );
    return;
  }

  // App files: cache first so the app can start offline.
  if (url.pathname.startsWith("/_next/static/")) {
    e.respondWith(
      caches.match(req).then(
        (hit) =>
          hit ||
          fetch(req).then((res) => {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy));
            return res;
          })
      )
    );
  }
});
