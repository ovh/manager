import angular from 'angular';

import component from './component';

const moduleName = 'ovhManagerPciComponentsProjectBillingArchiveStorageList';

angular
  .module(moduleName, [])
  .component('archiveStorageList', component);

export default moduleName;
