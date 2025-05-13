import angular from 'angular';

import component from './ovhPolicies.component';
import routing from './ovhPolicies.routing';

const moduleName = 'ovhManagerIAMOvhPolicies';

angular
  .module(moduleName, [])
  .component('iamOvhPolicies', component)
  .config(routing);

export default moduleName;
