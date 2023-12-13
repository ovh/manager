const devServerConfig = require('@ovh-ux/manager-dev-server-config');
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

  const envConfig = env.config || {};
  const proxy = [serverProxy.v6(region, envConfig)];

  const isContainer = env.container || process.env.CONTAINER;

  const sso = new Sso(region, envConfig);
  if (env.dev) {
    proxy.unshift(...env.dev.map((config) => serverProxy.dev(config)));
  }
  return {
    mode: 'development',
    devServer: {
      setupMiddlewares(middlewares, devServer) {
        devServer.app.get('/auth', sso.auth.bind(sso));
        devServer.app.get('/auth/check', sso.checkAuth.bind(sso));
        return middlewares;
      },
      host: env.host || process.env.npm_package_config_host || 'localhost',
      https: env.https || yn(process.env.npm_package_config_https) || false,
      client: {
        overlay: true,
        logging: 'none',
      },
      port:
        env.port ||
        Number.parseInt(process.env.npm_package_config_port, 10) ||
        isContainer
          ? 9001
          : 9000,
      proxy,
    },
    output: {
      publicPath: isContainer ? '/app/' : '/',
    },
  };
};
