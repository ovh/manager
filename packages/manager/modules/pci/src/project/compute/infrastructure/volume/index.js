import angular from 'angular';

import addEdit from './addEdit';

const moduleName = 'ovhManagerPciProjectComputeInfrastructureVolume';

angular
  .module(moduleName, [
    addEdit,
  ]);

export default moduleName;
