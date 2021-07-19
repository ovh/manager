import angular from 'angular';

import documentsListComponent from './list.component';

const moduleName = 'TelephonySvaWalletKycIdentityDocumentsList';

angular
  .module(moduleName, [])
  .component(
    'telephonySvaWalletKycIdentityDocumentsList',
    documentsListComponent,
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
