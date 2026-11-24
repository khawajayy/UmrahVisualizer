// Minimal offline cache for Umrah Mission Control.
// App shell: network-first (so updates land), falling back to cache.
// Fonts, photos and map tiles: cache-first with background refresh.
const VERSION = 'umrah26-v2'
const SHELL = ['./', './index.html', './favicon.svg', './manifest.webmanifest']

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(VERSION).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()))
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  )
})

const STATIC_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com', 'server.arcgisonline.com', 'upload.wikimedia.org']

self.addEventListener('fetch', (event) => {
  const req = event.request
  if (req.method !== 'GET') return
  const url = new URL(req.url)

  const isStatic = STATIC_HOSTS.some((h) => url.hostname.endsWith(h))
  if (isStatic) {
    event.respondWith(
      caches.open(VERSION).then(async (cache) => {
        const hit = await cache.match(req)
        const refresh = fetch(req)
          .then((res) => {
            if (res && (res.ok || res.type === 'opaque')) cache.put(req, res.clone())
            return res
          })
          .catch(() => hit)
        return hit || refresh
      }),
    )
    return
  }

  if (url.origin === self.location.origin) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone()
          caches.open(VERSION).then((c) => c.put(req, copy))
          return res
        })
        .catch(async () => (await caches.match(req)) || (req.mode === 'navigate' ? caches.match('./index.html') : undefined)),
    )
  }
})
