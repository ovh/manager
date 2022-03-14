import angular from 'angular';

import component from './bank-account.component';

const moduleName = 'TelephonySvaWalletKycIdentityBankAccount';

angular
  .module(moduleName, [])
  .component('telephonySvaWalletKycIdentityBankAccount', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
