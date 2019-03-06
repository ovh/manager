import angular from 'angular';

import service from './service';

const moduleName = 'ovhManagerPciComponentsProjectBilling';

angular
  .module(moduleName, [])
  .service('CloudProjectBillingDetailsDisplayHelper', service);

export default moduleName;
