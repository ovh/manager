import angular from 'angular';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@ovh-ux/ng-ovh-api-wrappers';
import 'ovh-api-services';

import projectPrices from '../../../prices';

import factory from './factory';
import virtualMachineFactory from './virtualMachine/factory';
import vlanFactory from './vlan/factory';

const moduleName = 'ovhManagerPciComponentsProjectComputeInfrastructureVrack';

angular
  .module(moduleName, [
    'ovh-api-services',
    projectPrices,
    'ngOvhCloudUniverseComponents',
  ])
  .factory('CloudProjectComputeInfraVrackFactory', factory)
  .factory('CloudProjectComputeInfraVrackVmFactory', virtualMachineFactory)
  .factory('CloudProjectComputeInfraVrackVlanFactory', vlanFactory);

export default moduleName;
