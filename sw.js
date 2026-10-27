/* Gezinti çevrimdışı çalışma
   - Sayfa (index.html): önce internet, olmazsa son kaydedilen kopya. Böylece yeni sürüm hemen gelir, çekmeyen yerde de açılır.
   - Simgeler, yazı tipleri ve Firebase kütüphanesi: önce kayıtlı kopya, arkada tazelenir.
   - Yer arama, hava tahmini, Firestore gibi canlı istekler hiç kaydedilmez. */
const KAP = "gezinti-v1";
const TEMEL = ["./", "./index.html", "./manifest.json", "./icon-192.png", "./icon-512.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(KAP).then(c => c.addAll(TEMEL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys()
    .then(ks => Promise.all(ks.filter(k => k.startsWith("gezinti-") && k !== KAP).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

const STATIK = [
  "https://fonts.googleapis.com/",
  "https://fonts.gstatic.com/",
  "https://www.gstatic.com/firebasejs/"
];

self.addEventListener("fetch", e => {
  const r = e.request;
  if (r.method !== "GET") return;
  const u = new URL(r.url);

  // Sayfanın kendisi: önce internet
  if (r.mode === "navigate" || (u.origin === location.origin && /\/(index\.html)?$/.test(u.pathname) && !u.search)) {
    e.respondWith(
      fetch(r).then(y => {
        if (y.ok) { const k = y.clone(); caches.open(KAP).then(c => c.put("./index.html", k)); }
        return y;
      }).catch(() => caches.match("./index.html").then(x => x || caches.match("./")))
    );
    return;
  }

  // Aynı sitedeki dosyalar ve izinli dış kütüphaneler: önce kayıtlı kopya
  const statik = (u.origin === location.origin && !u.search) || STATIK.some(p => r.url.startsWith(p));
  if (!statik) return;
  e.respondWith(
    caches.match(r).then(x => {
      const ag = fetch(r).then(y => {
        if (y && (y.ok || y.type === "opaque")) { const k = y.clone(); caches.open(KAP).then(c => c.put(r, k)); }
        return y;
      }).catch(() => x);
      return x || ag;
    })
  );
});
