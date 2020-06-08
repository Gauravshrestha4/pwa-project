self.addEventListener('install',e=>console.log('[SW] installing SW',e))
self.addEventListener('activate', e => {
    console.log('[SW] activating SW', e);
    return self.clients.claim();
})

self.addEventListener('fetch', (e) => {
    console.log('fetching data',e);
    return e.respondWith(fetch(e.request));
})