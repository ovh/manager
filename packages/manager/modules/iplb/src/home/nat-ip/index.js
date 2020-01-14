import angular from 'angular';
import '@uirouter/angularjs';

import routing from './iplb-nat-ip-detail.routing';
import natIpDetailComponent from './iplb-nat-ip-detail.component';

const moduleName = 'ovhManagerIplbNatIpDetailModule';

angular
  .module(moduleName, ['ui.router'])
  .config(routing)
  .component('iplbNatIpDetail', natIpDetailComponent)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
