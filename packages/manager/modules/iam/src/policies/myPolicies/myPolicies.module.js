import angular from 'angular';

import deleteModule from './delete';
import editModule from './edit';
import createModule from './create';

import component from './myPolicies.component';
import routing from './myPolicies.routing';

const moduleName = 'ovhManagerIAMDashboardMyPolicies';

angular
  .module(moduleName, [deleteModule, editModule, createModule])
  .component('iamMyPolicies', component)
  .config(routing);

export default moduleName;
