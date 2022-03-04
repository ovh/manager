import angular from 'angular';

import beneficiaries from '../beneficiaries';
import component from './summary.component';

import indentityOverview from '../overview-identity';
import bankAccount from './bank-account';

const moduleName = 'TelephonySvaWalletKycIdentitySummary';

angular
  .module(moduleName, [beneficiaries, indentityOverview, bankAccount])
  .component('telephonySvaWalletKycIdentitySummary', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
