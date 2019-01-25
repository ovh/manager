import angular from 'angular';

import routing from './billing-account-guides.routes';

const moduleName = 'ovhManagerTelephony.billingAccount.guides';

angular
  .module(moduleName, [])
  .config(routing);

export default moduleName;
