import angular from 'angular';

import component from './accountIdentities.component';

const moduleName = 'ovhManagerIAMAccountIdentities';

angular
  .module(moduleName, [])
  .component('iamAccountIdentities', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
