const devServerConfig = require('@ovh-ux/manager-dev-server-config');
const config = require('./config');

const sso = Object.assign(devServerConfig.sso);
const proxy = { ...devServerConfig.proxy };

module.exports = {
  sso,
  proxy,
  config,
};
