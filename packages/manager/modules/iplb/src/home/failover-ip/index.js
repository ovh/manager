import angular from 'angular';
import '@uirouter/angularjs';

import routing from './iplb-failover-ip-detail.routing';
import failoverIpComponent from './iplb-failover-ip-detail.component';

const moduleName = 'ovhManagerIplbFailoverIpModule';

angular
  .module(moduleName, ['ui.router'])
  .config(routing)
  .component('iplbFailoverIp', failoverIpComponent)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
