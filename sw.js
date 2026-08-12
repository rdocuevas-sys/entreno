/* ============================================================
   Service worker — Plan de entrenamiento
   ------------------------------------------------------------
   SUBE ESTE NÚMERO EN CADA CAMBIO QUE PUBLIQUES.
   Es lo único que hace que el teléfono se entere de que hay
   una versión nueva y muestre el aviso "Actualizar".
   ============================================================ */
const VERSION = 'v9';
const CACHE = `entreno-${VERSION}`;

const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-180.png',
  './fonts/barlow-condensed-500.woff2',
  './fonts/barlow-condensed-600.woff2',
  './fonts/barlow-condensed-700.woff2',
  './fonts/ibm-plex-mono-500.woff2',
  './fonts/ibm-plex-mono-600.woff2',
  './fonts/inter-var.woff2'
];

self.addEventListener('install', e=>{
  e.waitUntil(
    caches.open(CACHE).then(c=>c.addAll(ASSETS))
    /* sin skipWaiting: la versión nueva espera a que la persona
       apriete "Actualizar", para no cambiarle la app a media serie */
  );
});

self.addEventListener('activate', e=>{
  e.waitUntil((async ()=>{
    const claves = await caches.keys();
    await Promise.all(claves.filter(k=>k!==CACHE).map(k=>caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('message', e=>{
  if(e.data && e.data.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', e=>{
  const req = e.request;
  if(req.method !== 'GET') return;

  const url = new URL(req.url);
  if(url.origin !== self.location.origin) return;   // YouTube y demás van directo a la red

  /* Navegación: primero la red (para tomar la versión nueva),
     y si no hay señal, la copia guardada. */
  if(req.mode === 'navigate'){
    e.respondWith((async ()=>{
      try{
        const fresca = await fetch(req);
        const c = await caches.open(CACHE);
        c.put('./index.html', fresca.clone());
        return fresca;
      }catch(err){
        return (await caches.match('./index.html')) || Response.error();
      }
    })());
    return;
  }

  /* Resto de archivos: primero la copia guardada, que no cambian dentro de una versión */
  e.respondWith((async ()=>{
    const guardada = await caches.match(req);
    if(guardada) return guardada;
    try{
      const res = await fetch(req);
      if(res && res.ok && res.type === 'basic'){
        const c = await caches.open(CACHE);
        c.put(req, res.clone());
      }
      return res;
    }catch(err){
      return Response.error();
    }
  })());
});
