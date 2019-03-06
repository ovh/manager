import angular from 'angular';

import internet from './internet';
import vrack from './vrack';

import factory from './factory';
import filter from './filter';
import service from './service';

const moduleName = 'ovhManagerPciComponentsProjectComputeInfrastructure';

angular
  .module(moduleName, [
    internet,
    vrack,
  ])
  .factory('CloudProjectComputeInfrastructureFactory', factory)
  .filter('infrastructureFlavor', filter)
  .service('CloudProjectComputeInfrastructureOrchestrator', service);

export default moduleName;
