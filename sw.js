const CACHE_NAME = 'cinetrack-v2';
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
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS);
        })
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', (event) => {
    // Skip caching for API/External calls
    if (event.request.url.includes('api.themoviedb.org') || event.request.url.includes('supabase.co')) {
        return fetch(event.request);
    }

    event.respondWith(
        fetch(event.request).catch(() => {
            return caches.match(event.request);
        })
    );
});
