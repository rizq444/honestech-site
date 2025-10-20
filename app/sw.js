self.addEventListener('install', e=>{
  e.waitUntil(
    caches.open('honestech-v1').then(c=>c.addAll([
      './','./index.html','./styles.css','./main.js','./manifest.webmanifest','./icons/icon.svg'
    ]))
  );
  self.skipWaiting();
});
self.addEventListener('activate', e=> self.clients.claim());
self.addEventListener('fetch', e=> {
  e.respondWith(caches.match(e.request).then(r=> r || fetch(e.request)));
});
