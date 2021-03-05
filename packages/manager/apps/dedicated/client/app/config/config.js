import constantsConfig from './constants.config';

const aapiRootPath = '/engine/2api/';
const swsProxyRootPath = 'apiv6/';

const prodMode = !!WEBPACK_ENV.production;

export default {
  aapiRootPath,
  swsProxyRootPath,
  prodMode,
};

export const getConstants = (region) => {
  return constantsConfig[region];
};
