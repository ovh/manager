import angular from 'angular';

import './billing-account-manageContacts.less';

import routing from './billing-account-orderAlias-special.routes';

const moduleName = 'ovhManagerTelephony.billingAccount.orderAlias.special';

angular
  .module(moduleName, [])
  .config(routing);

export default moduleName;
