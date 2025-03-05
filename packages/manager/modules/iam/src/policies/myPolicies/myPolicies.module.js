import angular from 'angular';

import deleteModule from './delete';

import component from './myPolicies.component';
import routing from './myPolicies.routing';

const moduleName = 'ovhManagerIAMDashboardMyPolicies';

angular
  .module(moduleName, [deleteModule])
  .component('iamMyPolicies', component)
  .config(routing);

export default moduleName;
