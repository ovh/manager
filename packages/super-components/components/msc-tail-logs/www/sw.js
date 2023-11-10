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
    "revision": "7a9b6ac266c66b90c5f44f10d911a612"
  },
  {
    "url": "build/index.esm.js",
    "revision": "fbf92241ea7e31d49888c3b6af1552fa"
  },
  {
    "url": "build/p-072e864f.js"
  },
  {
    "url": "build/p-0cc556ba.js"
  },
  {
    "url": "build/p-0e7ce805.js"
  },
  {
    "url": "build/p-102e6f2a.js"
  },
  {
    "url": "build/p-4272d0a9.js"
  },
  {
    "url": "build/p-8294f3c5.js"
  },
  {
    "url": "build/p-917721f6.js"
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
    "url": "build/p-a5a1fdd7.js"
  },
  {
    "url": "build/p-c1b105b9.js"
  },
  {
    "url": "build/p-c59858b4.js"
  },
  {
    "url": "build/p-c6b48aa0.js"
  },
  {
    "url": "build/p-ceb48d8c.entry.js"
  },
  {
    "url": "build/p-eb06a81a.entry.js"
  },
  {
    "url": "mockServiceWorker.js",
    "revision": "a09fcdbcfad20cbc41c8b14044a156dc"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
