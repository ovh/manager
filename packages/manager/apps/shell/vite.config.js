const { defineConfig } = require('vite');
const reactRefresh = require('@vitejs/plugin-react-refresh');
const path = require('path');
const legacy = require('@vitejs/plugin-legacy');

const { proxy, sso: Sso } = require('@ovh-ux/manager-dev-server-config');
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

function viteOvhDevServerPlugin() {
  const region = process.env.REGION || 'EU';
  console.log('REGION', region);
  return {
    name: 'vite-ovh-dev-server',
    configureServer(server) {
      const sso = new Sso(region);
      const app = express();
      app.get('/auth', sso.auth.bind(sso));
      app.get('/auth/check', sso.checkAuth.bind(sso));
      const v6Proxy = proxy.v6(region);
      app.use(createProxyMiddleware(v6Proxy.context, v6Proxy));
      // app.use(createProxyMiddleware(proxy.aapi.context, proxy.aapi));
      server.middlewares.use(app);
    },
  };
}

module.exports = defineConfig({
  root: path.resolve(__dirname, 'src'),
  clearScreen: false,
  plugins: [
    reactRefresh(),
    legacy({
      targets: ['defaults'],
    }),
    viteOvhDevServerPlugin(),
  ],
  resolve: {
    alias: {
      src: path.resolve(__dirname, 'src'),
      // @TODO get non-relative monorepo root path
      '~': path.resolve(__dirname, '../../../../node_modules'),
    },
  },
  build: {
    outDir: path.resolve(__dirname, 'dist'),
    emptyOutDir: true,
    minify: true,
  },
  server: {
    port: 9000,
    open: true,
  },
});
