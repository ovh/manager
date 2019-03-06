import angular from 'angular';

import component from './component';

const moduleName = 'ovhManagerPciComponentsProjectBillingVolumeList';

angular
  .module(moduleName, [])
  .component('volumeList', component);

export default moduleName;
