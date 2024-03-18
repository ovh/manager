import angular from 'angular';
import component from './component';

const moduleName =
  'ovhManagerDedicatedAccountUserUploadIdentityDocumentsIndividualRequirements';

angular
  .module(moduleName, ['pascalprecht.translate'])
  .component('accountUploadIdentityDocumentsIndividualRequirements', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
