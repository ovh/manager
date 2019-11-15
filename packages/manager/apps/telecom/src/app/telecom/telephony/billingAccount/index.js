import angular from 'angular';

import services from './services';

import routing from './billingAccount.routing';

const moduleName = 'ovhManagerTelecomTelephonyBillingAccount';

angular
  .module(moduleName, [
    services,
  ])
  .config(routing);

export default moduleName;
