import angular from 'angular';
import { Environment } from '@ovh-ux/manager-config';

import getApiConfig from './apiConfig';

import { REDIRECT_URLS as REDIRECT_URLS_US, URLS as URLS_US } from './all.us';
import { REDIRECT_URLS as REDIRECT_URLS_CA, URLS as URLS_CA } from './all.ca';
import { REDIRECT_URLS as REDIRECT_URLS_EU, URLS as URLS_EU } from './all.eu';

const region = Environment.getRegion();
const production = !!WEBPACK_ENV.production;

const REDIRECT_URLS = {
  CA: REDIRECT_URLS_CA,
  EU: REDIRECT_URLS_EU,
  US: REDIRECT_URLS_US,
};

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
  .constant('REDIRECT_URLS', REDIRECT_URLS[region])
  .constant('URLS', URLS[region]);
