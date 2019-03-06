import angular from 'angular';

import component from './component';

const moduleName = 'ovhManagerPciComponentsProjectBilling';

angular
  .module(moduleName, [])
  .component('hourlyResourceList', component);

export default moduleName;
