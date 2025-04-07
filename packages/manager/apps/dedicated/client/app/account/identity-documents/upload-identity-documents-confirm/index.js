import angular from 'angular';

import component from './component';

const moduleName =
  'ovhManagerDedicatedAccountUserUploadIdentityDocumentsConfirm';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate'])
  .component('uploadIdentityDocumentsConfirm', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
