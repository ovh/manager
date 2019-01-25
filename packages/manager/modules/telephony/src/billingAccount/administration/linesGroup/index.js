import angular from 'angular';

import routing from './billing-account-administration-lines-group.routes';

const moduleName = 'ovhManagerTelephony.billingAccount.administration.linesGroup';

angular
  .module(moduleName, [])
  .config(routing);

export default moduleName;
