import angular from 'angular';

import component from './advancedPolicySearch.component';

const moduleName = 'ovhManagerIAMComponentAdvancedPolicySearch';

angular
  .module(moduleName, [])
  .component('iamAdvancedPolicySearch', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
