import angular from 'angular';

import component from './overview-identity.component';

const moduleName = 'TelephonySvaWalletKycIdentityOverviewIdentity';

angular
  .module(moduleName, [])
  .component('telephonySvaWalletKycIdentityOverviewIdentity', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
