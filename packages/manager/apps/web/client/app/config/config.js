import * as constantsConfig from './constants.config';

const aapiRootPath = '/engine/2api/';
const swsProxyRootPath = 'apiv6/';
const target = WEBPACK_ENV.region.toUpperCase(); // eslint-disable-line
const prodMode = !!WEBPACK_ENV.production; // eslint-disable-line

export default {
  aapiRootPath,
  swsProxyRootPath,
  constants: constantsConfig[target],
  prodMode,
  target,
};
