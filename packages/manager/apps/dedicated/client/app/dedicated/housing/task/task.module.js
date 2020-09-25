import angular from 'angular';
import '@uirouter/angularjs';

import controller from './dedicated-housing-task.controller';
import routing from './task.routes';

const moduleName = 'ovhManagerDedicatedHousingDashboardTask';

angular
  .module(moduleName, ['oui', 'ui.router'])
  .config(routing)
  .controller('HousingTaskCtrl', controller)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
