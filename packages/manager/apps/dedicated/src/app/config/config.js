import constantsConfig from './constants.config';

const aapiRootPath = '/engine/2api/';
const swsProxyRootPath = 'apiv6/';
const target = __WEBPACK_REGION__; // eslint-disable-line
const prodMode = !!WEBPACK_ENV.production; // eslint-disable-line

export default {
  aapiRootPath,
  swsProxyRootPath,
  constants: constantsConfig[target],
  prodMode,
  target,
};
