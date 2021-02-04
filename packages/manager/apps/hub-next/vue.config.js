/* eslint-disable @typescript-eslint/no-var-requires */
const devServer = require('@ovh-ux/manager-webpack-dev-server');

const env = {
  dev: [
    // custom configuration to proxy some routes
    {
      context: ['http://localhost:8080'],
      target: ['/engine/2api', '/engine/apiv6'], // API path to target
    },
  ],
  host: '0.0.0.0', // If you want your server to be accessible externally
  https: false, // true to enable https
  local2API: true, // true to make 2API calls on local 8080 port
  port: 8080, // Specify a port number to listen for requests.
  region: 'EU', // manager region (EU, CA, US)
};

const devConfig = devServer.config(env);
devConfig.devServer.proxy = { ...devConfig.devServer.proxy };

module.exports = {
  configureWebpack: devConfig,
};
