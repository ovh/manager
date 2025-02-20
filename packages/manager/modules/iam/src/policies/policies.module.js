import angular from 'angular';

import component from './policies.component';
import routing from './policies.routing';

const moduleName = 'ovhManagerIAMPolicies';

angular
  .module(moduleName, [])
  .component('iamPolicies', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
