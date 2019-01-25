import angular from 'angular';

import routing from './billing-account-billing-tollfree-history.routes';

const moduleName = 'ovhManagerTelephony.billingAccount.billing.tollfreeHistory';

angular
  .module(moduleName, [])
  .config(routing);

export default moduleName;
