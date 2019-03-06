import angular from 'angular';

import failoverFactory from './failover/factory';
import publicFactory from './public/factory';

import factory from './factory';

const moduleName = 'ovhManagerPciComponentsProjectComputeInfrastructureInternetIp';

angular
  .module(moduleName, [])
  .factory('CloudProjectComputeInfraIpFactory', factory)
  .factory('CloudProjectComputeInfraIpFailoverFactory', failoverFactory)
  .factory('CloudProjectComputeInfraIpPublicFactory', publicFactory);

export default moduleName;
