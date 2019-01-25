import angular from 'angular';

import routing from './billing-account-billing-repayment-history.routes';

const moduleName = 'ovhManagerTelephony.billingAccount.billing.repaymentHistory';

angular
  .module(moduleName, [])
  .config(routing);

export default moduleName;
