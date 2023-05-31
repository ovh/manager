import angular from 'angular';

import policies from './policies';

import component from './policy.component';
import routing from './policy.routing';

const moduleName = 'ovhManagerIAMPolicy';

angular
  .module(moduleName, [policies])
  .component('iamPolicy', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
