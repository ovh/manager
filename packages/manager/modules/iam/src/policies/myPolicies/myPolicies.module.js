import angular from 'angular';

import deleteModule from './delete';
import editModule from './edit';
import createModule from './create';
import searchModule from './advanced-search';

import component from './myPolicies.component';
import routing from './myPolicies.routing';

const moduleName = 'ovhManagerIAMDashboardMyPolicies';

angular
  .module(moduleName, [deleteModule, editModule, createModule, searchModule])
  .component('iamMyPolicies', component)
  .config(routing);

export default moduleName;
