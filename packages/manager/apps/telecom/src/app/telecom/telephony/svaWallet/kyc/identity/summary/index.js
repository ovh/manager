import angular from 'angular';

import beneficiaries from '../beneficiaries';
import component from './summary.component';

import indentityOverview from '../overview-identity';

const moduleName = 'TelephonySvaWalletKycIdentitySummary';

angular
  .module(moduleName, [beneficiaries, indentityOverview])
  .component('telephonySvaWalletKycIdentitySummary', component)
  .run(/* @ngTranslationsInject:json ./translations */)
  .run(/* @ngTranslationsInject:json ./updateBankAccount/translations */);

export default moduleName;
