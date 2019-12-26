import angular from 'angular';
import '@uirouter/angularjs';

import routing from './vps-option-terminate.routing';
import component from './vps-option-terminate.component';

const moduleName = 'vpsDashboardTerminateOptionModule';

angular
  .module(moduleName, ['ui.router'])
  .config(routing)
  .component('vpsDashboardTerminateOption', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
