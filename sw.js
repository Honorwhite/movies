const CACHE_NAME = 'cinetrack-v1';
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

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
