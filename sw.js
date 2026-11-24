// Mon Coffre : fonctionne hors ligne. Aucune donnée personnelle n'est envoyée nulle part.
// L'app s'affiche depuis l'iPhone, et la nouvelle version éventuelle est téléchargée
// en arrière-plan pour la prochaine ouverture.
const C = "moncoffre-v3";
const LOGOS = "moncoffre-logos";
const FILES = ["./", "./index.html", "./manifest.webmanifest", "./icon-180.png", "./icon-192.png", "./icon-512.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(C).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== C && k !== LOGOS).map(k => caches.delete(k))))); self.clients.claim(); });
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);
  if (url.hostname === "icons.duckduckgo.com") {
    // logo demandé une seule fois, puis gardé sur l'iPhone
    e.respondWith(caches.open(LOGOS).then(async cache => {
      const hit = await cache.match(e.request);
      if (hit) return hit;
      try { const r = await fetch(e.request, { referrerPolicy: "no-referrer" }); if (r.ok || r.type === "opaque") cache.put(e.request, r.clone()); return r; }
      catch { return new Response("", { status: 404 }); }
    }));
    return;
  }
  if (url.origin !== location.origin) return;
  e.respondWith(caches.open(C).then(async cache => {
    const cached = await cache.match(e.request, { ignoreSearch: true });
    const fresh = fetch(e.request, { cache: "no-cache" }).then(r => { if (r.ok) cache.put(e.request, r.clone()); return r; }).catch(() => null);
    if (cached) { e.waitUntil(fresh); return cached; }
    return (await fresh) || new Response("Hors ligne", { status: 503 });
  }));
});
