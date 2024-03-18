import angular from 'angular';
import component from './component';

const moduleName =
  'ovhManagerDedicatedAccountUserUploadIdentityDocumentsIndividualRequirements';

angular
  .module(moduleName, ['pascalprecht.translate'])
  .component('uploadIdentityDocumentsIndividualRequirements', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
