import angular from 'angular';

import routing from './billing-account-administration-delete-group.routes';

const moduleName = 'ovhManagerTelephony.billingAccount.administration.deleteGroup';

angular
  .module(moduleName, [])
  .config(routing);

export default moduleName;
