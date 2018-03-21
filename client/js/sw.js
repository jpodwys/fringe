var CACHE = 'simple-stack';
 
self.addEventListener('install', function(e) {
  e.waitUntil(caches.open(CACHE).then(function (cache) {
    cache.addAll(['/'/*, '/manifest.json', '/favicon.ico'*/]);
  }));
});
 
self.addEventListener('fetch', function(e) {
  if(e.request.method !== 'GET') return
  // if(~e.request.url.indexOf('/api')) return

  e.respondWith(fromCache(e.request));

  if(~url.indexOf('manifest')) return;
  e.waitUntil(
    update(e.request)
    .then(refresh)
  );
});
 
function fromCache(request) {
  return caches.open(CACHE).then(function (cache) {
    return cache.match(request);
  });
}
 
function update(request) {
  return caches.open(CACHE).then(function (cache) {
    return fetch(request).then(function (response) {
      if(response.status >= 300) return;
      return cache.put(request, response.clone()).then(function () {
        return response;
      });
    });
  });
}
 
function refresh(response) {
  if(!response) return;
  return self.clients.matchAll().then(function (clients) {
    clients.forEach(function (client) {
      client.postMessage(response.headers.get('ETag'));
    });
  });
}
