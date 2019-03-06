import angular from 'angular';

import ip from './ip';

import factory from './factory';

const moduleName = 'ovhManagerPciComponentsProjectComputeInfrastructureInternet';

angular
  .module(moduleName, [
    ip,
  ])
  .factory('CloudProjectComputeInfraInternetFactory', factory);

export default moduleName;
