import angular from 'angular';

import './billing-account-manageContacts.less';

import component from './billing-account-orderAlias-identity.component';

const moduleName = 'ovhManagerTelephony.billingAccount.orderAlias.identity';

angular
  .module(moduleName, [])
  .component('telecomTelephonyBillingAccountOrderAliasIdentity', component);

export default moduleName;
