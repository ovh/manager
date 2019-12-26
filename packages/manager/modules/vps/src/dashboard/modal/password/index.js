import angular from 'angular';
import '@uirouter/angularjs';

import routing from './vps-password.routing';
import component from './vps-password.component';

const moduleName = 'vpsDashboardRebootRescueModule';

angular
  .module(moduleName, ['ui.router'])
  .config(routing)
  .component('vpsDashboardRebootRescue', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
