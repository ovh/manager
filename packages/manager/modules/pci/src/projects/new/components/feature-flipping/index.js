/**
 *  @TODO: move this module in order to be used everywhere
 */

import angular from 'angular';

import provider from './provider';

const moduleName = 'pciProjectNewFeatureFlipping';

angular
  .module(moduleName, [])
  .provider('ovhFeatureFlipping', provider);

export default moduleName;
