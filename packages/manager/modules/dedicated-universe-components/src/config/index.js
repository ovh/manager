import { Environment } from '@ovh-ux/manager-config';
import constantsConfig from './constants.config';

const swsProxyRootPath = 'apiv6/';
const target = Environment.getRegion();

export default {
  swsProxyRootPath,
  ducConstants: constantsConfig[target],
};
