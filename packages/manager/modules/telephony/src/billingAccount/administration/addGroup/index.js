import angular from 'angular';

import routing from './billing-account-administration-add-group.routes';

const moduleName = 'ovhManagerTelephony.billingAccount.administration.addGroup';

angular
  .module(moduleName, [])
  .config(routing);

export default moduleName;
