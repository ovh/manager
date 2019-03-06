import angular from 'angular';

import component from './component';

const moduleName = 'ovhManagerPciComponentsProjectBilling';

angular
  .module(moduleName, [])
  .component('objectStorageList', component);

export default moduleName;
