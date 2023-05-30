import angular from 'angular';

import component from './policies.component';

const moduleName = 'ovhManagerIAMComponentsPolicies';

angular
  .module(moduleName, [])
  .component('iamPolicies', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
