import angular from 'angular';

import identities from '../identities';
import resourceSelect from '../resourceSelect';
import actionSelect from '../actionSelect';

import component from './advancedPolicySearch.component';
import './advancedPolicySearch.style.scss';

const moduleName = 'ovhManagerIAMComponentAdvancedPolicySearch';

angular
  .module(moduleName, [identities, resourceSelect, actionSelect])
  .component('iamAdvancedPolicySearch', component)
  .run(/* @ngTranslationsInject:json ./translations */)
  .run(/* @ngTranslationsInject:json ../identities/userIdentities/translations */)
  .run(/* @ngTranslationsInject:json ../identities/groupIdentities/translations */)
  .run(/* @ngTranslationsInject:json ../createPolicy/translations */);

export default moduleName;
