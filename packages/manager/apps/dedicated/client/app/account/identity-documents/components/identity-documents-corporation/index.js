import angular from 'angular';
import component from './component';

const moduleName =
  'ovhManagerDedicatedAccountUserUploadIdentityDocumentsCorporationRequirements';

angular
  .module(moduleName, ['pascalprecht.translate'])
  .component('accountUploadIdentityDocumentsCorporationRequirements', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
