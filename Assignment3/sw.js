const assets = [
    './',
    './index.html',
    './pages/fallback.html',
    './js/app.js',
    './js/ui.js',
    './js/materialize.min.js',
    './css/app.css',
    './css/materialize.min.css',
    './images/android-chrome-192x192.png',
    './images/android-chrome-512x512.png',
    'https://fonts.googleapis.com/icon?family=Material+Icons'
];

const dynamicCache = 'Dynamic-cache-v1';
const staticCache = 'Static-cache-v7';

self.addEventListener('install', (event) => {
    event.waitUntil(caches.open(staticCache)
    .then(cache => {
        console.log("SW: Precaching App shell");
        cache.addAll(assets)
    }))
    
});

// Cache size limit
const limitCache = (name, size) => {
    caches.open(name).then((cache) => {
        cache.keys().then(keys => {
            if(keys.length > size) {
                cache.delete(keys[0]).then(limitCacheSize(name,size))
            }
        })
    })
};

self.addEventListener('activate', (event) => {
    event.waitUntil(caches.keys().then(keys => {
        return Promise.all(keys.filter(key => key !== staticCache && key !== dynamicCache)
        .map(key => caches.delete(key)))
    }))
});

self.addEventListener('fetch', (event) => {
    event.respondWith(caches.match(event.request).then(response => {
        return response || fetch(event.request).then(fetchResp => {
            return caches.open(dynamicCache).then(cache => {
                cache.put(event.request.url, fetchResp.clone())
                limitCacheSize(dynamicCache, 3);
                return fetchResp;
            })
        });
    }).catch(() => caches.match('./pages/fallback.html')) 
    );
});

//caches is cache storage in the chrome deve tools
//cache is one item inside of the cache
//