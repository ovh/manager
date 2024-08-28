import angular from 'angular';
import component from './component';

const moduleName =
  'ovhManagerDedicatedAccountUserUploadIdentityDocumentsUploadDetail';

angular
  .module(moduleName, ['pascalprecht.translate'])
  .component('accountUploadIdentityDocumentsUploadDetail', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
