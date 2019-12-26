import * as constantsConfig from './constants.config';

const aapiRootPath = '/engine/2api/';
const swsProxyRootPath = 'apiv6/';
const target = WEBPACK_ENV.region.toUpperCase();
const prodMode = !!WEBPACK_ENV.production;

export default {
  aapiRootPath,
  swsProxyRootPath,
  constants: constantsConfig[target],
  prodMode,
  target,
};
