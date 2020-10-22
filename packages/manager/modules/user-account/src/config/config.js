import { Environment } from '@ovh-ux/manager-config';
import constantsConfig from './constants.config';

const aapiRootPath = '/engine/2api/';
const swsProxyRootPath = 'apiv6/';

const target = Environment.getRegion();
// const prodMode = !!WEBPACK_ENV.production;

export default {
  aapiRootPath,
  swsProxyRootPath,
  constants: constantsConfig[target],
  // prodMode,
  target,
};
