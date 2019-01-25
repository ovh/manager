import angular from 'angular';

import routing from './billing-account-billing-deposit-movement.routes';

const moduleName = 'ovhManagerTelephony.billingAccount.billing.depositMovement';

angular
  .module(moduleName, [])
  .config(routing);

export default moduleName;
