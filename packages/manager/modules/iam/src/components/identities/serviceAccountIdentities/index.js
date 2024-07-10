import angular from 'angular';

import component from './serviceAccountIdentities.component';

const moduleName = 'ovhManagerIAMServiceAccountIdentities';

angular
  .module(moduleName, [])
  .component('iamServiceAccountIdentities', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
