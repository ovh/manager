const { defineConfig } = require('vite');
const fs = require('fs');
const reactRefresh = require('@vitejs/plugin-react-refresh');
const path = require('path');
const legacy = require('@vitejs/plugin-legacy');

const { proxy, sso: Sso } = require('@ovh-ux/manager-dev-server-config');
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const { env } = require('process');

function viteOvhDevServerPlugin() {
  const region = process.env.REGION || 'EU';
  return {
    name: 'vite-ovh-dev-server',
    configureServer(server) {
      const sso = new Sso(region);
      const app = express();

      const appDistPath = path.join(
        __dirname,
        '../',
        process.env.APP || '',
        'dist',
      );
      const appEntryPoint = path.join(appDistPath, 'index.html');
      if (!fs.existsSync(appEntryPoint)) {
        app.all('/app', (req, res) => {
          res.status(404).send('Application not found');
        });
      } else {
        app.use('/app', express.static(appDistPath));
      }

      app.get('/auth', sso.auth.bind(sso));
      app.get('/auth/check', sso.checkAuth.bind(sso));

      if (env.local2API) {
        app.use(proxy.aapi.context, createProxyMiddleware(proxy.aapi));
      }

      const v6Proxy = proxy.v6(region);
      app.use(createProxyMiddleware(v6Proxy.context, v6Proxy));

      server.middlewares.use(app);
    },
  };
}

module.exports = defineConfig({
  base: './',
  root: path.resolve(__dirname, 'src'),
  clearScreen: false,
  publicDir: 'public',
  resolve: {
    alias: {
      '@': path.resolve(path.join(__dirname, 'src')),
    },
  },
  plugins: [
    reactRefresh(),
    legacy({
      targets: ['defaults'],
    }),
    viteOvhDevServerPlugin(),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        includePaths: [path.resolve(__dirname, '../../../../node_modules')],
      },
    },
  },
  build: {
    outDir: path.resolve(__dirname, 'dist'),
    emptyOutDir: true,
    minify: true,
  },
  server: {
    port: 9000,
    strictPort: true,
  },
});
