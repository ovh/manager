import express from 'express';
import fs from 'fs';
import path from 'path';
import { env } from 'process';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { proxy, sso as Sso } from '@ovh-ux/manager-dev-server-config';

export default function viteOvhDevServerPlugin(isContainerApp) {
  const region = process.env.REGION || 'EU';
  return {
    name: 'vite-ovh-dev-server',
    configureServer(server) {
      const sso = new Sso(region);
      const app = express();

      if (isContainerApp) {
        if (process.env.APP) {
          // serve application's dist locally
          const appDistPath = path.join(
            process.cwd(),
            '../../core/',
            process.env.APP,
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
        } else {
          // proxy to application dev server
          app.use(
            '/app',
            createProxyMiddleware({
              target: 'http://localhost:9001/',
              changeOrigin: true,
            }),
          );
        }
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
