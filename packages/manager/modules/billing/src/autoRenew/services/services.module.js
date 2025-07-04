import angular from 'angular';

import component from './services.component';
import routing from './services.routing';

const moduleName = 'ovhManagerBillingAutorenewServices';

angular
  .module(moduleName, [])
  .config(routing)
  .component('services', component);

export default moduleName;
