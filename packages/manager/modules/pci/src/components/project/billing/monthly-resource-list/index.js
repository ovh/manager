import angular from 'angular';

import component from './component';

const moduleName = 'ovhManagerPciComponentsProjectBillingMonthlyResourceList';

angular
  .module(moduleName, [])
  .component('monthlyResourceList', component);

export default moduleName;
