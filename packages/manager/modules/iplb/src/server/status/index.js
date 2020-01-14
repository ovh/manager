import angular from 'angular';
import '@uirouter/angularjs';

import routing from './iplb-server-status-detail.routing';
import statusComponent from './iplb-server-status-detail.component';

const moduleName = 'ovhManagerIplbServerStatusModule';

angular
  .module(moduleName, ['ui.router'])
  .config(routing)
  .component('iplbServerStatus', statusComponent)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
