import angular from 'angular';
import '@ovh-ux/manager-core';

import service from './billing.service';
import billingLinksService from './billing.links.service';

const moduleName = 'ovhManagerBillingUtilities';

angular
  .module(moduleName, ['ovhManagerCore'])
  .service('BillingService', service)
  .service('BillingLinksService', billingLinksService);

export default moduleName;
