import angular from 'angular';

import create from './create';
import edit from './edit';
import policies from './policies';
import resourceGroups from './resourceGroups';

import component from './policy.component';
import routing from './policy.routing';

const moduleName = 'ovhManagerIAMPolicy';

angular
  .module(moduleName, [create, edit, policies, resourceGroups])
  .component('iamPolicy', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
