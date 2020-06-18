import DuplicatePackageCheckerPlugin from 'duplicate-package-checker-webpack-plugin';
import FriendlyErrorsWebpackPlugin from 'friendly-errors-webpack-plugin';
import yn from 'yn';

import Sso from './sso';
import serverProxy from './proxy';

export = (env) => {
  const region = (
    env.region ||
    process.env.REGION ||
    process.env.npm_package_config_region ||
    'eu'
  ).toLowerCase();
  const proxy: any[] = [serverProxy.v6(region)];
  const sso = new Sso(region);

  if (yn(env.local2API) || yn(process.env.npm_package_config_local2API)) {
    proxy.unshift(serverProxy.aapi);
  }
  if (env.dev) {
    proxy.unshift(...env.dev.map((config) => serverProxy.dev(config)));
  }

  proxy.unshift({
    context: ['/ufrontend'],
    changeOrigin: true,
    target: 'http://localhost:9001',
    logLevel: 'debug',
    pathRewrite: {
      '^/ufrontend': '/',
    },
  });

  return {
    mode: 'development',
    plugins: [
      new DuplicatePackageCheckerPlugin(),
      new FriendlyErrorsWebpackPlugin(),
    ],
    devServer: {
      before(app) {
        app.get('/auth', sso.auth.bind(sso));
        app.get('/auth/check', sso.checkAuth.bind(sso));
      },
      clientLogLevel: 'none',
      logLevel: 'silent',
      host: env.host || process.env.npm_package_config_host || 'localhost',
      https: env.https || yn(process.env.npm_package_config_https) || false,
      overlay: true,
      port:
        env.port ||
        Number.parseInt(process.env.npm_package_config_port, 10) ||
        9000,
      proxy,
    },
  };
};
