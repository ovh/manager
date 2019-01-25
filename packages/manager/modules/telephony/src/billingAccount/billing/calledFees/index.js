import angular from 'angular';

import routing from './billing-account-billing-called-fees.routes';

const moduleName = 'ovhManagerTelephony.billingAccount.billing.calledFees';

angular
  .module(moduleName, [])
  .config(routing);

export default moduleName;
