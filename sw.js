const CACHE_NAME = 'gym-tracker-v4';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './style.css',
    './app.js',
    './manifest.json',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[ServiceWorker] Caching app shell');
                return cache.addAll(ASSETS_TO_CACHE);
            })
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== CACHE_NAME) {
                    console.log('[ServiceWorker] Removing old cache', key);
                    return caches.delete(key);
                }
            }));
        })
    );
});

self.addEventListener('fetch', (event) => {
    // ESTRATEGIA DE DEBUGGING: Network Only (Bypass Cache temporariamente)
    // Esto obliga a descargar siempre los archivos nuevos.
    console.log('[ServiceWorker] Fetching (Network Only):', event.request.url);
    event.respondWith(fetch(event.request));

    /*
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Return cache hit or fetch network
                return response || fetch(event.request);
            })
    );
    */
});
