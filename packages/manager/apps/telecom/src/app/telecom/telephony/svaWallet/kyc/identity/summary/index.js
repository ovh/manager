import angular from 'angular';

import beneficiaries from '../beneficiaries';
import component from './summary.component';

const moduleName = 'TelephonySvaWalletKycIdentitySummary';

angular
  .module(moduleName, [beneficiaries])
  .component('telephonySvaWalletKycIdentitySummary', component)
  .run(/* @ngTranslationsInject:json ./translations */)
  .run(/* @ngTranslationsInject:json ./updateBankAccount/translations */);

export default moduleName;
