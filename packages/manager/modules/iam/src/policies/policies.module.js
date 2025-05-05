import angular from 'angular';

import myPolicies from './myPolicies';
import ovhPolicies from './ovhPolicies';
import resourceGroups from './resourceGroups';

import component from './policies.component';
import routing from './policies.routing';

const moduleName = 'ovhManagerIAMPolicies';

angular
  .module(moduleName, [myPolicies, ovhPolicies, resourceGroups])
  .component('iamPolicies', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
