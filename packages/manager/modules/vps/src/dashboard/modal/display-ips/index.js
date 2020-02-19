import angular from 'angular';
import '@uirouter/angularjs';

import routing from './vps-display-ips.routing';
import component from './vps-display-ips.component';

const moduleName = 'vpsDashboardDisplayIpsModule';

angular
  .module(moduleName, ['ui.router'])
  .config(routing)
  .component('vpsDashboardDisplayIps', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
