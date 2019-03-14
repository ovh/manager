import angular from 'angular';

import component from './component';

const moduleName = 'ovhManagerPciComponentsProjectBillingObjectStorageList';

angular
  .module(moduleName, [])
  .component('objectStorageList', component);

export default moduleName;
