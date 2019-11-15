import angular from 'angular';

import lines from './lines';

import routing from './billingAccount.routing';

const moduleName = 'ovhManagerTelecomTelephonyBillingAccount';

angular
  .module(moduleName, [
    lines,
  ])
  .config(routing);

export default moduleName;
