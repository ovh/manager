import angular from 'angular';
import '@uirouter/angularjs';

import routing from './vps-monitoring-sla.routing';
import component from './vps-monitoring-sla.component';

const moduleName = 'vpsDashboardMonitoringSlaModule';

angular
  .module(moduleName, ['ui.router'])
  .config(routing)
  .component('vpsDashboardMonitoringSla', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
