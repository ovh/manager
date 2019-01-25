import angular from 'angular';

import routing from './billing-account-phonebook.routes';

const moduleName = 'ovhManagerTelephony.billingAccount.phonebook';

angular
  .module(moduleName, [])
  .config(routing);

export default moduleName;
