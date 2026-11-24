// Mon Coffre : fonctionne hors ligne. Aucune donnée n'est envoyée nulle part.
// Stratégie : la version en cache s'affiche tout de suite, et la nouvelle version
// est téléchargée en arrière-plan pour la prochaine ouverture.
const C = "moncoffre-v2";
const FILES = ["./", "./index.html", "./manifest.webmanifest", "./icon-180.png", "./icon-192.png", "./icon-512.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(C).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== C).map(k => caches.delete(k))))); self.clients.claim(); });
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET" || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(caches.open(C).then(async cache => {
    const cached = await cache.match(e.request, { ignoreSearch: true });
    const fresh = fetch(e.request, { cache: "no-cache" }).then(r => { if (r.ok) cache.put(e.request, r.clone()); return r; }).catch(() => null);
    if (cached) { e.waitUntil(fresh); return cached; }
    return (await fresh) || new Response("Hors ligne", { status: 503 });
  }));
});
