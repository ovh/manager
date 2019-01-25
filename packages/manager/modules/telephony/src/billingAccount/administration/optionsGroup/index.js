import angular from 'angular';

import routing from './billing-account-administration-options-group.routes';

const moduleName = 'ovhManagerTelephony.billingAccount.administration.optionsGroup';

angular
  .module(moduleName, [])
  .config(routing);

export default moduleName;
