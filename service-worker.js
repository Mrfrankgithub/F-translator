const CACHE_NAME = "F3in1-app-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/main.html",
  "/weather.html",
  "/offline.html",
  "/style.css",
  "/main.css",
  "/toastr.min.css",
  "/weather.css",
  "/toastr.min.js",
  "/jquery.min.js",
  "/translator/main.js",
  "/converter/script.js",
  "/weather/weather.js",
];

// Install event
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache");
      return cache.addAll(urlsToCache);
    })
  );
});

// Fetch event
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return (
        response ||
        fetch(event.request).catch(() => {
          // Serve offline.html for navigation requests
          if (event.request.mode === "navigate") {
            return caches.match("/offline.html");
          }
        })
      );
    })
  );
});

// Activate event
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log("Deleting old cache:", cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});
