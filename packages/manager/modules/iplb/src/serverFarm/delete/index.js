import angular from 'angular';
import '@uirouter/angularjs';

import routing from './iplb-server-farm-delete.routing';
import deleteComponent from './iplb-server-farm-delete.component';

const moduleName = 'ovhManagerIplbServerFarmDeleteModule';

angular
  .module(moduleName, ['ui.router'])
  .config(routing)
  .component('iplbServerFarmDelete', deleteComponent)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
