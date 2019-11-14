import angular from 'angular';

import routing from './billingAccount.routing';

const moduleName = 'ovhManagerTelecomTelephonyBillingAccount';

angular
  .module(moduleName, [])
  .config(routing);

export default moduleName;
