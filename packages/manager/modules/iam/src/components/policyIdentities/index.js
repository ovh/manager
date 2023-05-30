import angular from 'angular';

import component from './policyIdentities.component';

const moduleName = 'ovhManagerIAMComponentsPolicyIdentities';

angular
  .module(moduleName, [])
  .component('iamPolicyIdentities', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
