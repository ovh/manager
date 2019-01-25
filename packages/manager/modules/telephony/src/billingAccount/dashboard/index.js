import angular from 'angular';

import routing from './billing-account-dashboard.routes';

const moduleName = 'ovhManagerTelephony.billingAccount.dashboard';

angular
  .module(moduleName, [])
  .config(routing);

export default moduleName;
