import angular from 'angular';
import '@uirouter/angularjs';

import routing from './iplb-frontends-delete.routing';
import deleteComponent from './iplb-frontends-delete.component';

const moduleName = 'ovhManagerIplbFrontendsDeleteModule';

angular
  .module(moduleName, [
    'ui.router',
  ])
  .config(routing)
  .component('ovhManagerIplbFrontendsDelete', deleteComponent)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
