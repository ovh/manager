import angular from 'angular';

import './billing-account-manageContacts.less';

import component from './billing-account-orderAlias-numberChoice.component';
import componentType from './type/billing-account-orderAlias-numberChoice-type.component';

const moduleName = 'ovhManagerTelephony.billingAccount.orderAlias.numberChoice';

angular
  .module(moduleName, [])
  .component('telecomTelephonyBillingAccountOrderAliasNumberChoice', component)
  .component('telecomTelephonyBillingAccountOrderAliasNumberChoiceType', componentType);

export default moduleName;
