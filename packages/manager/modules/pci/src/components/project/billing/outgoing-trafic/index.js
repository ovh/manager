import angular from 'angular';

import component from './component';

const moduleName = 'ovhManagerPciComponentsProjectBillingOutgoingTrafic';

angular
  .module(moduleName, [])
  .component('outgoingTrafic', component);

export default moduleName;
