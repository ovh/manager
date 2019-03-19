import angular from 'angular';
import '@ovh-ux/ng-ovh-cloud-universe-components';

import ip from './ip';

import factory from './factory';

const moduleName = 'ovhManagerPciComponentsProjectComputeInfrastructureInternet';

angular
  .module(moduleName, [
    'ngOvhCloudUniverseComponents',
    ip,
  ])
  .factory('CloudProjectComputeInfraInternetFactory', factory);

export default moduleName;
