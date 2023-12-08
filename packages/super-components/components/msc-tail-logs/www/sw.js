/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "index.html",
    "revision": "1d9eca32038f2e632ceb89a52d607ec0"
  },
  {
    "url": "build/index.esm.js",
    "revision": "9671f79c87a4ed53c319c3a31ae6f88c"
  },
  {
    "url": "build/p-06159712.entry.js"
  },
  {
    "url": "build/p-072e864f.js"
  },
  {
    "url": "build/p-0e7ce805.js"
  },
  {
    "url": "build/p-102e6f2a.js"
  },
  {
    "url": "build/p-3945a2de.js"
  },
  {
    "url": "build/p-4272d0a9.js"
  },
  {
    "url": "build/p-57ac9257.js"
  },
  {
    "url": "build/p-72f4222c.js"
  },
  {
    "url": "build/p-8294f3c5.js"
  },
  {
    "url": "build/p-950c0ed7.js"
  },
  {
    "url": "build/p-a24a55fe.js"
  },
  {
    "url": "build/p-a2cd7500.js"
  },
  {
    "url": "build/p-aa7d13bd.js"
  },
  {
    "url": "build/p-c1b105b9.js"
  },
  {
    "url": "build/p-d73613f4.entry.js"
  },
  {
    "url": "build/p-ec19c1c0.js"
  },
  {
    "url": "build/p-f5e5c4e0.js"
  },
  {
    "url": "mockServiceWorker.js",
    "revision": "a09fcdbcfad20cbc41c8b14044a156dc"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
