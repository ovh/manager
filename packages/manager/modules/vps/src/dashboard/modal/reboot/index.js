import angular from 'angular';
import '@uirouter/angularjs';

import routing from './vps-reboot.routing';
import component from './vps-reboot.component';

const moduleName = 'vpsDashboardRebootModule';

angular
  .module(moduleName, ['ui.router'])
  .config(routing)
  .component('vpsDashboardReboot', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
