import angular from 'angular';

import component from './kyc-identity-form.component';

const moduleName = 'TelephonySvaWalletKycIdenityForm';

angular
  .module(moduleName, [])
  .component('telephonySvaWalletKycIdenityForm', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
