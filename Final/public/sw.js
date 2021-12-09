const assets = [
    './index.html',
    './about.html',
    // './404.html',
    './add.html',
    './fallback.html',
    './js/app.js',
    './js/ui.js',
    './js/materialize.min.js',
    './css/app.css',
    './css/materialize.min.css',
    './images/caduceus192x192.png',
    './images/caduceus512x512.png',
    'https://fonts.googleapis.com/icon?family=Material+Icons'
];

const dynamicCache = 'Dynamic-cache-v16';
const staticCache = 'Static-cache-v16';

self.addEventListener('install', (event) => {
    event.waitUntil(caches.open(staticCache)
    .then(cache => {
        console.log("SW: Precaching App shell");
        cache.addAll(assets).catch(e => console.log(e));
    }))
    
});

// Cache size limit
const limitCache = (name, size) => {
    caches.open(name).then((cache) => {
        cache.keys().then(keys => {
            if(keys.length > size) {
                cache.delete(keys[0]).then(limitCache(name,size))
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
  // if(event.request.url.indexOf("firestore.googleapis.com") === -1) {
    event.respondWith(caches.match(event.request).then(response => {
      return response || fetch(event.request).then((fetchResp) => 
      caches.open(dynamicCache).then(cache => {
        cache.put(event.request.url, fetchResp.clone());
        limitCache(dynamicCache, 15);
        return fetchResp;
      }));
      }).catch(() => caches.match('./fallback.html')) 
    );
  // }
    
    
});

//caches is cache storage in the chrome dev tools
//cache is one item inside of the cache
//