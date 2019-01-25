import angular from 'angular';

import routing from './billing-account-abbreviatedNumbers.routes';

const moduleName = 'ovhManagerTelephony.billingAccount.abbreviatedNumbers';

angular
  .module(moduleName, [])
  .config(routing);

export default moduleName;
