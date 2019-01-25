import angular from 'angular';

import routing from './billing-account-billing-bill.routes';

const moduleName = 'ovhManagerTelephony.billingAccount.billing.bill';

angular
  .module(moduleName, [])
  .config(routing);

export default moduleName;
