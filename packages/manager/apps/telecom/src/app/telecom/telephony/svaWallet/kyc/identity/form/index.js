import angular from 'angular';

import component from './form.component';

const moduleName = 'TelephonySvaWalletKycIdentityForm';

angular
  .module(moduleName, [])
  .component('telephonySvaWalletKycIdentityForm', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
