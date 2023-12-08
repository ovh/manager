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
    "revision": "f699982798f7aad2e5ad839d4f323464"
  },
  {
    "url": "build/index.esm.js",
    "revision": "88d0d86d3a33a8b99418fe382ee696af"
  },
  {
    "url": "build/p-0debc1a1.js"
  },
  {
    "url": "build/p-17642315.js"
  },
  {
    "url": "build/p-1a65e44f.entry.js"
  },
  {
    "url": "build/p-1b21fc66.js"
  },
  {
    "url": "build/p-49702bee.js"
  },
  {
    "url": "build/p-6d6ba160.js"
  },
  {
    "url": "build/p-8a07baa1.js"
  },
  {
    "url": "build/p-8f4484c1.js"
  },
  {
    "url": "build/p-91b4f74d.js"
  },
  {
    "url": "build/p-afbfb165.js"
  },
  {
    "url": "build/p-b6b4826f.js"
  },
  {
    "url": "build/p-ba3323b2.js"
  },
  {
    "url": "build/p-dfa64fe7.js"
  },
  {
    "url": "mockServiceWorker.js",
    "revision": "a09fcdbcfad20cbc41c8b14044a156dc"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
