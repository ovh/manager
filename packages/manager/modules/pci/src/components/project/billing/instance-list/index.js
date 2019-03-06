import angular from 'angular';

import component from './component';

const moduleName = 'ovhManagerPciComponentsProjectBilling';

angular
  .module(moduleName, [])
  .component('instanceList', component);

export default moduleName;
