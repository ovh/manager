import angular from 'angular';

import add from './add';

const moduleName = 'ovhManagerPciProjectComputeInfrastructureVirtualMachine';

angular
  .module(moduleName, [
    add,
  ]);

export default moduleName;
