// Nombre del caché
const CACHE_NAME = 'pwa-pokemon-cache-v1';

// Archivos a cachear (recursos estáticos del App Shell)
const urlsToCache = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/js/app.js',
  '/manifest/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Instalar el Service Worker
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Instalando...');

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Almacenando archivos en caché...');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => console.error('[Service Worker] Error al cachear archivos:', error))
  );
});

// Activar el Service Worker
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activado.');

  // Eliminar cachés antiguas si es necesario
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[Service Worker] Eliminando caché antigua:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Interceptar peticiones de red (Fetch Event)
self.addEventListener('fetch', (event) => {
  console.log('[Service Worker] Fetch de:', event.request.url);

  // Estrategia: Network-first para solicitudes a la API, Cache-first para recursos estáticos
  if (event.request.url.includes('https://pokeapi.co/api/v2/')) {
    // Estrategia para solicitudes a la PokéAPI: Network-first
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return fetch(event.request)
          .then((response) => {
            // Si el fetch tiene éxito, actualiza la caché
            cache.put(event.request.url, response.clone());
            return response;
          })
          .catch(() => {
            // Si falla la red, intenta obtener el recurso de la caché
            return cache.match(event.request);
          });
      })
    );
  } else {
    // Estrategia para recursos estáticos: Cache-first
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        return cachedResponse || fetch(event.request);
      })
    );
  }
});
