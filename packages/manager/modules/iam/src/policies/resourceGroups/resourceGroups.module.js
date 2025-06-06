import angular from 'angular';

import deleteModule from './delete';
import createModule from './create';
import editModule from './edit';

import component from './resourceGroups.component';
import routing from './resourceGroups.routing';

const moduleName = 'ovhManagerIAMDashboardResourceGroups';

angular
  .module(moduleName, [deleteModule, createModule, editModule])
  .component('iamResourceGroups', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
