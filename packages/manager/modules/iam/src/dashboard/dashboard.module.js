import angular from 'angular';

import policies from './policies';
import resourceGroups from './resourceGroups';
import users from './users/users.module';

import component from './dashboard.component';
import routing from './dashboard.routing';

const moduleName = 'ovhManagerIAMDashboard';

angular
  .module(moduleName, [policies, resourceGroups, users])
  .component('iamDashboard', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
