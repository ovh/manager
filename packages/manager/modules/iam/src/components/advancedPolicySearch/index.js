import angular from 'angular';

import component from './advancedPolicySearch.component';

const moduleName = 'ovhManagerIAMComponentAdvancedPolicySearch';

angular
  .module(moduleName, [])
  .component('iamAdvancedPolicySearch', component)
  .run(/* @ngTranslationsInject:json ./translations */)
  .run(/* @ngTranslationsInject:json ../identities/userIdentities/translations */)
  .run(/* @ngTranslationsInject:json ../identities/groupIdentities/translations */);

export default moduleName;
