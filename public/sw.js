importScripts('/src/js/idb.js')
importScripts('/src/js/utility.js');

var CACHE_STATIC_NAME = 'static-v18'
var CACHE_DYNAMIC_NAME = 'dynamic-2'
var STATIC_FILES=['/',
'/index.html',
'offline.html',
'/src/js/app.js',
'/src/js/promise.js',
'/src/js/fetch.js',
'/src/js/idb.js',
'/src/js/utility.js',
'/src/js/material.min.js',
'/src/css/app.css',
'/src/css/feed.css',
'/src/images/main-image.jpg',
'https://fonts.googleapis.com/css?family=Roboto:400,700',
'https://fonts.googleapis.com/icon?family=Material+Icons',
'https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css'
]


function isInArray(str,arr){
  for (var i = 0; i < arr.length; i++){
    if(arr[i]==='str') return true
  }
}
self.addEventListener('install', function(event) {
  console.log('[Service Worker] Installing Service Worker ...', event);
  event.waitUntil(caches.open(CACHE_STATIC_NAME)
    .then(function (cache) {
      cache.addAll(STATIC_FILES);
     
  }))
});

self.addEventListener('activate', function(event) {
  console.log('[Service Worker] Activating Service Worker ....', event);
  event.waitUntil(
    caches.keys().
      then(function (keyList) {
        return Promise.all(keyList.map(key => {
          console.log('deleting caches');
          if (key != CACHE_STATIC_NAME && key != CACHE_DYNAMIC_NAME) return caches.delete(key);
      }))
    })
  )
  return self.clients.claim();
});
// cache with network fallback
self.addEventListener('fetch', function (event) {
  var url='https://pwa-101-bdd28.firebaseio.com/posts.json'
  if (event.request.url.indexOf(url) > -1) {
    event.respondWith(fetch(event.request)
      .then(res => {
        var clonedRes = res.clone();
        clearAllData('posts').then(function () {
          return clonedRes.json()
        })
          .then(data => {
            for (var key in data) {
              console.log('key',key)
              writeData('posts',data[key])
            }
          });
        return res;
      })
    );
  }
  else if (isInArray(event.request.url, STATIC_FILES)) {
    event.respondWith(
       cache.match(event.request)
    )
  }
  else {
    event.respondWith(
     
        caches.match(event.request)
          .then(response => {
            if (response) {
            return response
            }
            else {
              return fetch(event.request).
                then(res => {
                  return caches.open(CACHE_DYNAMIC_NAME).
                    then(cache => {
                      cache.put(event.request.url, res.clone());
                      return res;
                  })
                }).catch(err => {
                  return caches.open(CACHE_STATIC_NAME)
                    .then(function (cache) {
                      if (event.request.headers.get('accept').includes('index/html')) {
                        
                        return cache.match('/offline.html');
                      }
                  })
              })
            }
        })
      );
  }
});

self.addEventListener('sync', event => {
  console.log('background syncing')
  if (event.tag == 'sync-new-posts') {
    console.log('syncing new posts');
    event.waitUntil(
      readAllData('sync-posts').
        then(function(data){
          for (var dt of data) {
            fetch('https://pwa-101-bdd28.firebaseio.com/posts.json', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Accept':'application/json'
              },
              body: JSON.stringify({
                id:dt.id,
                title: dt.title,
                location: dt.location,
                image:'asdfdfs'
              })
            })
              .then(res => {
                console.log('data send', res)
                if (res.ok) {
                  deleteItemFromData('sync-posts',dt.id)
                }
              }).
              catch(err => {
              console.log(err)
            })
          }
        }
      )
    )
  }
})
// self.addEventListener('fetch', function(event) {
//   event.respondWith(
//     caches.match(event.request)
//       .then(response => {
//         if (response) {
//         return response
//         }
//         else {
//           return fetch(event.request).
//             then(res => {
//               return caches.open(CACHE_DYNAMIC_NAME).
//                 then(cache => {
//                   cache.put(event.request.url, res.clone());
//                   return res;
//               })
//             }).catch(err => {
//               return caches.open(CACHE_STATIC_NAME)
//                 .then(function (cache) {
//                   return cache.match('/offline.html');
//               })
//           })
//         }
//     })
//   );
// });

// network with cache fallback
// self.addEventListener('fetch', function (event) {
//   event.respondWith(
//     fetch(event.request).
//       then(res => {
//         return res;
//       }).
//       catch(err => {
//         caches.match(event.request)
//           .then(res => {
//             if (res) {
//               return res;
//             }
            
//         })
//     })
//   )
//   });