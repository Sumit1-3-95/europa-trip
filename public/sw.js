const CACHE = "europa-v1";
const OFFLINE_URLS = [
  "/today",
  "/journey",
  "/vibes",
  "/explore",
  "/lists",
  "/login",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(OFFLINE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  // Network-first for API / Supabase calls
  if (url.hostname.includes("supabase.co")) {
    event.respondWith(
      fetch(event.request).catch(() => new Response(JSON.stringify([]), { headers: { "Content-Type": "application/json" } }))
    );
    return;
  }
  // Cache-first for everything else
  event.respondWith(
    caches.match(event.request).then((cached) =>
      cached ?? fetch(event.request).then((res) => {
        const clone = res.clone();
        caches.open(CACHE).then((cache) => cache.put(event.request, clone));
        return res;
      })
    )
  );
});
