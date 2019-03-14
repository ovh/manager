import angular from 'angular';

import service from './service';

const moduleName = 'ovhManagerPciComponentsProjectBillingDetails';

angular
  .module(moduleName, [])
  .service('CloudProjectBillingDetailsDisplayHelper', service);

export default moduleName;
