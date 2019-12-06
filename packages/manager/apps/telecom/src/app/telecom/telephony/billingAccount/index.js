import angular from 'angular';

import services from './services';

import routing from './billingAccount.routing';
import service from './billingAccount.service';

const moduleName = 'ovhManagerTelecomTelephonyBillingAccount';

angular
  .module(moduleName, [
    services,
  ])
  .config(routing)
  .service('telecomBillingAccount', service);

export default moduleName;
