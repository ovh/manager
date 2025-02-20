import angular from 'angular';

import policies from './policies';
import resourceGroups from './resourceGroups';
import applications from './applications';

import component from './dashboard.component';
import routing from './dashboard.routing';

const moduleName = 'ovhManagerIAMDashboard';

angular
  .module(moduleName, [policies, resourceGroups, applications])
  .component('iamDashboard', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
