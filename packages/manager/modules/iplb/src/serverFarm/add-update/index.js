import angular from 'angular';
import '@uirouter/angularjs';

import routing from './iplb-server-farm-add-update.routing';
import addUpdateComponent from './iplb-server-farm-add-update.component';

const moduleName = 'ovhManagerIplbServerFarmadd-updateModule';

angular
  .module(moduleName, ['ui.router'])
  .config(routing)
  .component('iplbServerFarmAddUpdate', addUpdateComponent)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
