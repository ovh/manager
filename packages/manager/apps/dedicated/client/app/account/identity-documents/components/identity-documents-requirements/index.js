import angular from 'angular';
import component from './component';

const moduleName =
  'ovhManagerDedicatedAccountUserUploadIdentityDocumentsRequirements';

angular
  .module(moduleName, ['pascalprecht.translate'])
  .component('accountUploadIdentityDocumentsRequirements', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
