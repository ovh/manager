import angular from 'angular';

import routing from './billing-account-billing-deposit.routes';

const moduleName = 'ovhManagerTelephony.billingAccount.billing.deposit';

angular
  .module(moduleName, [])
  .config(routing);

export default moduleName;
