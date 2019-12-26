import angular from 'angular';

import cucConfig from '../config';

import CucFeatureAvailabilityService from './service';

const moduleName = 'cucFeatureAvailability';

angular
  .module(moduleName, [cucConfig])
  .service('CucFeatureAvailabilityService', CucFeatureAvailabilityService);

export default moduleName;
