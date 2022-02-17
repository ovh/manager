import angular from 'angular';

import component from './overview-identity-edit.component';

const moduleName = 'TelephonySvaWalletKycIdentityOverviewIdentityEdit';

angular
  .module(moduleName, [])
  .component('telephonySvaWalletKycIdentityOverviewIdentityEdit', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
