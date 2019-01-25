import angular from 'angular';

import routing from './billing-account-billing-group-repayments.routes';

const moduleName = 'ovhManagerTelephony.billingAccount.billing.groupRepayments';

angular
  .module(moduleName, [])
  .config(routing);

export default moduleName;
