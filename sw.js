const CACHE_VERSION = 'v2';
const STATIC_ASSESTS = [
  'https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,600;1,400&display=swap',
  '/sw-registration.js',
  '/lights-out.css',
  '/lights-out.js',
  '/manifest.json',
  'index.html',
  '/icon.jpg',
  '/icon.ico',
  '/',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(`static-site-${CACHE_VERSION}`).then((cache) => {
      cache.addAll(STATIC_ASSESTS);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      const OLD_CACHES = keys.filter((key) => !key.includes(CACHE_VERSION));

      if (OLD_CACHES.length) {
        return Promise.all(OLD_CACHES.map((key) => caches.delete(key)));
      }
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((res) => {
      return res || fetch(event.request);
    })
  );
});

self.addEventListener('message', (event) => {
  switch (event.data.type) {
    case 'UPDATE':
      console.log('ran');
      self.skipWaiting();
      break;
  }
});
