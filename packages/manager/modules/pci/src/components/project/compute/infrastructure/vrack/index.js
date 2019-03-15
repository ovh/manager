import angular from 'angular';

import factory from './factory';
import virtualMachineFactory from './virtualMachine/factory';
import vlanFactory from './vlan/factory';

const moduleName = 'ovhManagerPciComponentsProjectComputeInfrastructureVrack';

angular
  .module(moduleName, [
  ])
  .factory('CloudProjectComputeInfraVrackFactory', factory)
  .factory('CloudProjectComputeInfraVrackVmFactory', virtualMachineFactory)
  .factory('CloudProjectComputeInfraVrackVlanFactory', vlanFactory);

export default moduleName;
