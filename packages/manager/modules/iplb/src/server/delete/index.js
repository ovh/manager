import angular from 'angular';
import '@uirouter/angularjs';

import routing from './iplb-server-delete.routing';
import deleteComponent from './iplb-server-delete.component';

const moduleName = 'ovhManagerIplbServerDeleteModule';

angular
  .module(moduleName, ['ui.router'])
  .config(routing)
  .component('iplbServerDelete', deleteComponent)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
