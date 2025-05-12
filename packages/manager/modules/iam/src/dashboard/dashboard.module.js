import angular from 'angular';

import component from './dashboard.component';
import routing from './dashboard.routing';

const moduleName = 'ovhManagerIAMDashboard';

angular
  .module(moduleName, [])
  .component('iamDashboard', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
