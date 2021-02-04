/* eslint-disable @typescript-eslint/no-var-requires */
const devServer = require('@ovh-ux/manager-webpack-dev-server');

const env = {
  host: '0.0.0.0', // If you want your server to be accessible externally
  https: false, // true to enable https
  local2API: false, // true to make 2API calls on local 8080 port
  port: 9000, // Specify a port number to listen for requests.
  region: 'EU', // manager region (EU, CA, US)
};

const devConfig = devServer.config(env);

const proxyConfig = devConfig.devServer.proxy.reduce(
  (allProxy, proxy) => {
    if (Array.isArray(proxy.context)) {
      return {
        ...allProxy,
        ...proxy.context.reduce((allContext, context) => ({ ...allContext, [context]: proxy }), {}),
      };
    }
    return {
      ...allProxy,
      [proxy.context]: proxy,
    };
  }, {},
);

devConfig.devServer.proxy = proxyConfig;

module.exports = {
  configureWebpack: devConfig,
};
