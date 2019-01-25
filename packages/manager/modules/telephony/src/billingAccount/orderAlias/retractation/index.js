import angular from 'angular';

import './billing-account-manageContacts.less';

import component from './billing-account-orderAlias-retractation.component';

const moduleName = 'ovhManagerTelephony.billingAccount.orderAlias.retractation';

angular
  .module(moduleName, [])
  .component('telecomTelephonyBillingAccountOrderAliasNumberChoiceRetractation', component);

export default moduleName;
