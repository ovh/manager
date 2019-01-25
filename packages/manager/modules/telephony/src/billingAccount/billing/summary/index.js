import angular from 'angular';

import routing from './billing-account-billing-summary.routes';

const moduleName = 'ovhManagerTelephony.billingAccount.billing.summary';

angular
  .module(moduleName, [])
  .config(routing);

export default moduleName;
