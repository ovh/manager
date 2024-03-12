import angular from 'angular';
import component from './component';

const moduleName =
  'ovhManagerDedicatedAccountUserUploadIdentityDocumentsIndRequirements';

angular
  .module(moduleName, ['pascalprecht.translate'])
  .component('uploadIdentityDocumentsIndRequirements', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
