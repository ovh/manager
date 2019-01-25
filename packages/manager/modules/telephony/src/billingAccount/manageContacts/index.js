import angular from 'angular';

import './billing-account-manageContacts.less';

import routing from './billing-account-manageContacts.routes';

const moduleName = 'ovhManagerTelephony.billingAccount.manageContacts';

angular
  .module(moduleName, [])
  .config(routing);

export default moduleName;
