import angular from 'angular';

import component from './overview-identity.component';
import indentityOverviewEdit from './overview-identity-edit';

const moduleName = 'TelephonySvaWalletKycIdentityOverviewIdentity';

angular
  .module(moduleName, [indentityOverviewEdit])
  .component('telephonySvaWalletKycIdentityOverviewIdentity', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
