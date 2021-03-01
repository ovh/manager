import * as constantsConfig from './constants.config';

const aapiRootPath = '/engine/2api/';
const swsProxyRootPath = 'apiv6/';
const prodMode = !!WEBPACK_ENV.production;

export default (region) => ({
  aapiRootPath,
  swsProxyRootPath,
  constants: constantsConfig[region],
  prodMode,
  target: region,
});
