const CACHE_NAME="euoff-barbearia-pwa-v9";
const APP_SHELL=["./","./index.html","./manifest.webmanifest","./icon-192.png","./icon-512.png","./icon-maskable-512.png","./apple-touch-icon.png","./euoff-barbearia-horizontal.png","./euoff-barbearia-logo.png"];

self.addEventListener("install",function(event){
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE_NAME).then(function(cache){return cache.addAll(APP_SHELL);}));
});

self.addEventListener("activate",function(event){
  event.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.map(function(key){if(key!==CACHE_NAME)return caches.delete(key);}));
    }).then(function(){return self.clients.claim();})
  );
});

self.addEventListener("fetch",function(event){
  if(event.request.method!=="GET")return;
  if(event.request.mode==="navigate"){
    event.respondWith(
      fetch(event.request).then(function(response){
        var copy=response.clone();
        caches.open(CACHE_NAME).then(function(cache){cache.put("./index.html",copy);});
        return response;
      }).catch(function(){return caches.match("./index.html");})
    );
    return;
  }
  event.respondWith(caches.match(event.request).then(function(cached){return cached||fetch(event.request);}));
});