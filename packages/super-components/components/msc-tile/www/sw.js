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
    "revision": "b433f3bd04cc28d0834f5df276a0c619"
  },
  {
    "url": "build/index.esm.js",
    "revision": "721804061610d21432584f9a07f365c3"
  },
  {
    "url": "build/p-0057bea0.js"
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
    "url": "build/p-359df68c.js"
  },
  {
    "url": "build/p-53b03491.entry.js"
  },
  {
    "url": "build/p-8fdcae45.js"
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
    "url": "build/p-f1e4a3b3.js"
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
