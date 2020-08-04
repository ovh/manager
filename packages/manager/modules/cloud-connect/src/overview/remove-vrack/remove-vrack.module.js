import angular from 'angular';

import component from './remove-vrack.component';
import routing from './remove-vrack.routing';

const moduleName = 'ovhCloudConnectRemoveVrack';

angular
  .module(moduleName, [])
  .config(routing)
  .component('cloudConnectRemoveVrack', component);

export default moduleName;
