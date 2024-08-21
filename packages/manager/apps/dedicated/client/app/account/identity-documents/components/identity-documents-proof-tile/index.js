import angular from 'angular';
import component from './component';
import './style.scss';

const moduleName =
  'ovhManagerDedicatedAccountUserUploadIdentityDocumentsProofTile';

angular
  .module(moduleName, ['pascalprecht.translate'])
  .component('accountUploadIdentityDocumentsProofTile', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
