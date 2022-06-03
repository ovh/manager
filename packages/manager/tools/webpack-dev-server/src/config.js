const devServerConfig = require('@ovh-ux/manager-dev-server-config');
const DuplicatePackageCheckerPlugin = require('duplicate-package-checker-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const yn = require('yn');

const serverProxy = { ...devServerConfig.proxy };
const Sso = Object.assign(devServerConfig.sso);

module.exports = (env) => {
  const region = (
    env.region ||
    process.env.REGION ||
    process.env.npm_package_config_region ||
    'eu'
  ).toLowerCase();
  const proxy = [
    serverProxy.v6(region),
    serverProxy.registry(region, {
      local:
        yn(env.localRegistry) ||
        yn(process.env.npm_package_config_localRegistry),
      registryUrl:
        env.registryUrl || process.env.npm_package_config_registryUrl,
    }),
  ];

  const sso = new Sso(region);

  if (yn(env.local2API) || yn(process.env.npm_package_config_local2API)) {
    proxy.unshift(serverProxy.aapi);
  }
  if (env.dev) {
    proxy.unshift(...env.dev.map((config) => serverProxy.dev(config)));
  }
  return {
    mode: 'development',
    plugins: [
      new DuplicatePackageCheckerPlugin(),
      new FriendlyErrorsWebpackPlugin(),
    ],
    devServer: {
      onBeforeSetupMiddleware(devServer) {
        devServer.app.get('/auth', sso.auth.bind(sso));
        devServer.app.get('/auth/check', sso.checkAuth.bind(sso));
      },
      client: {
        logging: 'none',
      },
      logLevel: 'silent',
      host: env.host || process.env.npm_package_config_host || 'localhost',
      https: env.https || yn(process.env.npm_package_config_https) || false,
      port:
        env.port ||
        Number.parseInt(process.env.npm_package_config_port, 10) ||
        9000,
      proxy,
    },
  };
};
