// skift versionen når filerne ændres, så gamle caches bliver slettet
const STATIC_CACHE = "vejr-static-v16";
const API_CACHE = "vejr-api-v2";

const FILES = [
  "./",
  "./index.html",
  "./manifest.json",
  "./css/style.css",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-512-maskable.png",
  "./icons/apple-touch-icon.png",
  "./js/main.js",
  "./js/model/model.js",
  "./js/views/view.js",
  "./js/controller.js",
  "./js/helpers/weatherCodes.js",
  "./js/helpers/windDirection.js",
  "./js/helpers/weatherEffect.js",
  "./js/helpers/location.js",
  "./js/components/atoms.js",
  "./js/components/molecules.js",
  "./js/components/organisms.js"
];


// gem alle statiske filer når service workeren installeres
self.addEventListener("install", function (event) {

  event.waitUntil(
    caches.open(STATIC_CACHE).then(function (cache) {
      return cache.addAll(FILES);
    })
  );

  self.skipWaiting();
});


// slet gamle caches
self.addEventListener("activate", function (event) {

  event.waitUntil(
    caches.keys().then(function (names) {
      return Promise.all(
        names.map(function (name) {
          if (name !== STATIC_CACHE && name !== API_CACHE) {
            return caches.delete(name);
          }
        })
      );
    }).then(function () {
      // tag kontrol over åbne sider med det samme, ikke først ved næste besøg
      return self.clients.claim();
    })
  );
});


self.addEventListener("fetch", function (event) {

  if (event.request.method !== "GET") {
    return;
  }

  const url = new URL(event.request.url);

  if (url.hostname === "api.open-meteo.com") {
    event.respondWith(networkFirst(event.request));
  } else if (url.origin === self.location.origin) {
    event.respondWith(cacheFirst(event.request));
  }
});


// API: prøv nettet først, ellers brug cache
async function networkFirst(request) {

  const cache = await caches.open(API_CACHE);

  try {
    const response = await fetch(request);

    if (response.ok) {
      try {
        await cache.put(request, response.clone());
      } catch (error) {
        // svaret er stadig fint, det blev bare ikke gemt
        console.warn("Kunne ikke gemme API-svar:", error);
      }
    }

    return response;
  } catch (error) {
    // ingen forbindelse, så vi bruger den gemte version
    const cached = await cache.match(request);

    if (cached) {
      return cached;
    } else {
      throw error;
    }
  }
}


// Statiske filer: cache first, fallback til nettet.
// Nye versioner af filerne kommer frem, når STATIC_CACHE får et nyt nummer.
async function cacheFirst(request) {

  const cache = await caches.open(STATIC_CACHE);
  const cached = await cache.match(request);

  if (cached) {
    return cached;
  }

  // ikke i cachen - hent fra nettet og gem til næste gang
  const response = await fetch(request);

  if (response.ok) {
    try {
      await cache.put(request, response.clone());
    } catch (error) {
      console.warn("Kunne ikke gemme i cache:", error);
    }
  }

  return response;
}
