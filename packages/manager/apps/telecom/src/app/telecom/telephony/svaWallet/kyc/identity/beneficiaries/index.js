import angular from 'angular';

import beneficiariesComponent from './beneficiaries.component';
import beneficiariesListComponent from './list/list.component';

const moduleName = 'TelephonySvaWalletKycIdentityFormBeneficiaries';

angular
  .module(moduleName, [])
  .component('telephonySvaWalletKycBeneficiaries', beneficiariesComponent)
  .component(
    'telephonySvaWalletKycBeneficiariesList',
    beneficiariesListComponent,
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
