import angular from 'angular';
import '@uirouter/angularjs';

import routing from './vps-reverse-dns.routing';
import component from './vps-reverse-dns.component';

const moduleName = 'vpsDashboardReverseDnsModule';

angular
  .module(moduleName, ['ui.router'])
  .config(routing)
  .component('vpsDashboardReverseDns', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
