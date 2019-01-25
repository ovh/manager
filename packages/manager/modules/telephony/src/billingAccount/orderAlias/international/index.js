import angular from 'angular';

import './billing-account-manageContacts.less';

import routing from './billing-account-orderAlias-international.routes';

const moduleName = 'ovhManagerTelephony.billingAccount.orderAlias.international';

angular
  .module(moduleName, [])
  .config(routing);

export default moduleName;
