import angular from 'angular';

import component from './remove-pop-configuration.component';
import routing from './remove-pop-configuration.routing';

const moduleName = 'ovhCloudConnectRemovePopConfiguration';

angular
  .module(moduleName, [])
  .config(routing)
  .component('cloudConnectRemovePopConfiguration', component);

export default moduleName;
