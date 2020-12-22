import angular from 'angular';
import { Environment } from '@ovh-ux/manager-config';

import getApiConfig from './apiConfig';

import { URLS as URLS_US } from './all.us';
import { URLS as URLS_CA } from './all.ca';
import { URLS as URLS_EU } from './all.eu';

const region = Environment.getRegion();
const production = !!WEBPACK_ENV.production;

const URLS = {
  CA: URLS_CA,
  EU: URLS_EU,
  US: URLS_US,
};

angular
  .module('managerApp')
  .constant('UNIVERSE', 'CLOUD')
  .constant('CONFIG', {
    env: production ? 'production' : 'development',
  })
  .constant('CONFIG_API', getApiConfig(region, production))
  .constant('URLS', URLS[region]);
