import angular from 'angular';
import '@ovh-ux/manager-core';

import service from './billing.service';

const moduleName = 'ovhManagerBillingUtilities';

angular
  .module(moduleName, ['ovhManagerCore'])
  .service('BillingService', service);

export default moduleName;
