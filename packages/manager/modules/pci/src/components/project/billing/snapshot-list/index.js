import angular from 'angular';

import component from './component';

const moduleName = 'ovhManagerPciComponentsProjectBillingSnapshotList';

angular
  .module(moduleName, [])
  .component('snapshotList', component);

export default moduleName;
