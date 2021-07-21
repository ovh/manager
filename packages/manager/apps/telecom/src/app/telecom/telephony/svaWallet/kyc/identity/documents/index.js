import angular from 'angular';

import documentsComponent from './documents.component';

import list from './list';

const moduleName = 'TelephonySvaWalletKycIdentityDocuments';

angular
  .module(moduleName, [list])
  .component('telephonySvaWalletKycIdentityDocuments', documentsComponent)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
