import constantsConfig from './constants.config';

const swsProxyRootPath = 'apiv6/';

export default {
  swsProxyRootPath,
};

export const getConstants = (region) => {
  return constantsConfig[region];
};
