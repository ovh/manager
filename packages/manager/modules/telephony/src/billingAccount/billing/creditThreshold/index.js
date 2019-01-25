import angular from 'angular';

import routing from './billing-account-billing-credit-threshold.routes';

const moduleName = 'ovhManagerTelephony.billingAccount.billing.creditThreshold';

angular
  .module(moduleName, [])
  .config(routing);

export default moduleName;
