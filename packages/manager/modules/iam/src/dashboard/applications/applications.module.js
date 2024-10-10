import angular from 'angular';

import component from './applications.component';
import routing from './applications.routing';
import deleteModule from './delete';

const moduleName = 'ovhManagerIAMDashboardApplications';

angular
  .module(moduleName, [deleteModule])
  .component('iamApplications', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
