import angular from 'angular';
import component from './component';

const moduleName =
  'ovhManagerDedicatedAccountUserUploadIdentityDocumentsCorpRequirements';

angular
  .module(moduleName, ['pascalprecht.translate'])
  .component('uploadIdentityDocumentsCorpRequirements', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
