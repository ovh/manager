import angular from 'angular';

import component from './ovhPolicies.component';
import routing from './ovhPolicies.routing';
import editModule from './edit';

const moduleName = 'ovhManagerIAMOvhPolicies';

angular
  .module(moduleName, [editModule])
  .component('iamOvhPolicies', component)
  .config(routing);

export default moduleName;
