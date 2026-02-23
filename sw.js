const CACHE_NAME = 'cinetrack-v3';
const ASSETS = [
    './',
    './index.html',
    './style.css',
    './script.js',
    './manifest.json',
    './appimages/android/android-launchericon-48-48.png',
    './appimages/android/android-launchericon-72-72.png',
    './appimages/android/android-launchericon-96-96.png',
    './appimages/android/android-launchericon-144-144.png',
    './appimages/android/android-launchericon-192-192.png',
    './appimages/android/android-launchericon-512-512.png'
];

self.addEventListener('install', (event) => {
    self.skipWaiting(); // Force the waiting service worker to become the active service worker
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS);
        })
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        Promise.all([
            self.clients.claim(), // Take control of all pages immediately
            caches.keys().then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== CACHE_NAME) {
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
        ])
    );
});

self.addEventListener('fetch', (event) => {
    const url = event.request.url;

    // Do NOT call respondWith for localhost, TMDB, or Supabase
    // This allows the browser to handle these requests normally (including connection errors)
    if (url.includes('localhost') || url.includes('127.0.0.1') || url.includes('api.themoviedb.org') || url.includes('supabase.co')) {
        return;
    }

    event.respondWith(
        fetch(event.request)
            .catch(() => caches.match(event.request))
            .then((response) => {
                return response || new Response('Offline', { status: 404 });
            })
    );
});
