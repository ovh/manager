import angular from 'angular';

import './billing-account-manageContacts.less';

import component from './billing-account-orderAlias-coordinate.component';
import componentAddress from './address/billing-account-orderAlias-coordinate-address.component';
import componentIdentity from './identity/billing-account-orderAlias-coordinate-identity.component';

const moduleName = 'ovhManagerTelephony.billingAccount.orderAlias.coordinate';

angular
  .module(moduleName, [])
  .component('telecomTelephonyBillingAccountOrderAliasCoordinate', component)
  .component('telecomTelephonyBillingAccountOrderAliasCoordinateAddress', componentAddress)
  .component('telecomTelephonyBillingAccountOrderAliasCoordinateIdentity', componentIdentity);

export default moduleName;
