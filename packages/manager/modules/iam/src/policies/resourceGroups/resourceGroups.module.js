import angular from 'angular';

import deleteModule from './delete';

import component from './resourceGroups.component';
import routing from './resourceGroups.routing';

const moduleName = 'ovhManagerIAMDashboardResourceGroups';

angular
  .module(moduleName, [deleteModule])
  .component('iamResourceGroups', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
