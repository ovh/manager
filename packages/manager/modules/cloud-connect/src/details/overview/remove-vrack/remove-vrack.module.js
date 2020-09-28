import angular from 'angular';

import component from './remove-vrack.component';
import routing from './remove-vrack.routing';

const moduleName = 'ovhCloudConnectDetailsRemoveVrack';

angular
  .module(moduleName, [])
  .config(routing)
  .component('cloudConnectDetailsRemoveVrack', component);

export default moduleName;
