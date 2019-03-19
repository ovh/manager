import angular from 'angular';
import '@ovh-ux/ng-ovh-api-wrappers';
import 'ovh-api-services';

import failoverFactory from './failover/factory';
import publicFactory from './public/factory';

import factory from './factory';

const moduleName = 'ovhManagerPciComponentsProjectComputeInfrastructureInternetIp';

angular
  .module(moduleName, [
    'ovh-api-services',
  ])
  .factory('CloudProjectComputeInfraIpFactory', factory)
  .factory('CloudProjectComputeInfraIpFailoverFactory', failoverFactory)
  .factory('CloudProjectComputeInfraIpPublicFactory', publicFactory);

export default moduleName;
