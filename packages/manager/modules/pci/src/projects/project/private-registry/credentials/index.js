import angular from 'angular';
import credentialsComponent from './credentials.component';

const moduleName = 'ovhManagerPciProjectPrivateRegistryGenerateCredentials';

angular
  .module(moduleName, [])
  .component('credentialsComponent', credentialsComponent)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
