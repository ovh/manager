import angular from 'angular';
import '@uirouter/angularjs';

import routing from './migrate-confirm.routing';
import component from './migrate-confirm.component';

const moduleName = 'ovhManagerVpsMigrateVpsConfirm';

angular
  .module(moduleName, ['ui.router'])
  .config(routing)
  .component('ovhManagerVpsDashboardMigrateVpsConfirm', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
