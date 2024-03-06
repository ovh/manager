import angular from 'angular';

import component from './groupIdentities.component';

const moduleName = 'ovhManagerIAMGroupIdentity';

angular
  .module(moduleName, [])
  .component('iamGroupIdentities', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
