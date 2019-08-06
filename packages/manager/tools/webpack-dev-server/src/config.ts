import DuplicatePackageCheckerPlugin from 'duplicate-package-checker-webpack-plugin';
import FriendlyErrorsWebpackPlugin from 'friendly-errors-webpack-plugin';

import Sso from './sso';
import serverProxy from './proxy';

export = (env) => {
  const region = (env.region || 'eu').toLowerCase();
  const proxy = [serverProxy.v6(region)];
  const sso = new Sso(region);

  if (env.local2API) {
    proxy.unshift(serverProxy.aapi);
  }
  if (env.dev) {
    proxy.unshift(
      ...env.dev.map(config => serverProxy.dev(config)),
    );
  }
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
      https: env.https || false,
      overlay: true,
      host: env.host || 'localhost',
      port: 9000,
      proxy,
    },
  };
};
