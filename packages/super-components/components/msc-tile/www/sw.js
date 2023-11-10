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
    "revision": "baefae39dd6bb44858a27855eb164788"
  },
  {
    "url": "build/index.esm.js",
    "revision": "a77fee2c03b4245f72907585058f6dc1"
  },
  {
    "url": "build/p-049d3aba.js"
  },
  {
    "url": "build/p-218454e4.js"
  },
  {
    "url": "build/p-304f3c55.js"
  },
  {
    "url": "build/p-3345aaff.js"
  },
  {
    "url": "build/p-4cad3913.js"
  },
  {
    "url": "build/p-67dd87d5.js"
  },
  {
    "url": "build/p-82b8d32b.js"
  },
  {
    "url": "build/p-958dea74.entry.js"
  },
  {
    "url": "build/p-d432e45f.js"
  },
  {
    "url": "build/p-df65212c.js"
  },
  {
    "url": "build/p-ecd475ec.js"
  },
  {
    "url": "build/p-f6b4279a.js"
  },
  {
    "url": "mockServiceWorker.js",
    "revision": "a09fcdbcfad20cbc41c8b14044a156dc"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
