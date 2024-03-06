import angular from 'angular';

import component from './userIdentities.component';

const moduleName = 'ovhManagerIAMUserIdentity';

angular
  .module(moduleName, [])
  .component('iamUserIdentities', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
