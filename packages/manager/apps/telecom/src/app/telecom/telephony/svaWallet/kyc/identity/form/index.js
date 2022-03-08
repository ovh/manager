import angular from 'angular';

import component from './form.component';

const moduleName = 'TelephonySvaWalletKycIdentityForm';

angular
  .module(moduleName, [])
  .component('telephonySvaWalletKycIdentityForm', component)
  .run(/* @ngTranslationsInject:json ./translations */)
  .run(/* @ngTranslationsInject:json ./confirm/translations */);

export default moduleName;
