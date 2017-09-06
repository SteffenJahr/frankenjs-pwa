// Service Worker version
const version = '1.0';

// Cached files
const cacheFiles = [
    './', // You have to chache 'empty' because your request isn't index.html all the time
    './index.html',
    './assets/logo.jpg'
];

// Fill caches on install event of the service worker
self.addEventListener('install', function (event) {
    event.waitUntil(caches.open('frankenjs')
        .then(function (cache) {
            return cache.addAll(cacheFiles);
        }));
});

// Claim all clients on activate. So the the client is now under control of the service worker
self.addEventListener('activate', function (event) {
    event.waitUntil(clients.claim());
});

// Receive messages from the application
self.addEventListener('message', function (messageEvent) {
    // If the text of the message is 'version' send back the version number of the service worker
    if (messageEvent.data === 'version') {
        self.clients.matchAll().then(function (clients) {
            clients.forEach(function (client) {
                client.postMessage(version);
            })
        })
    }
    // If the text of the message is 'update' activate this service worker
    if (messageEvent.data === 'update') {
        self.skipWaiting();
    }
});

// Listen on all network requests and check if there is a cached response
self.addEventListener('fetch', function (event) {
    event.respondWith(
        self.caches.match(event.request)
            .then(function (cacheItem) {
                if (cacheItem) {
                    console.log('[ServiceWorker] Resolved from cache: ', event.request.url);
                }
                return cacheItem || self.fetch(event.request);
            })
    );
});

// Receive sync events from the client
self.addEventListener('sync', function (event) {
    console.info('[ServiceWorker] Sync request received!', event.tag);
});
