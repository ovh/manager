import angular from 'angular';
import '@uirouter/angularjs';

import routing from './iplb-frontends-edit.routing';
import editComponent from './iplb-frontends-edit.component';

const moduleName = 'ovhManagerIplbFrontendsEditModule';

angular
  .module(moduleName, [
    'ui.router',
  ])
  .config(routing)
  .component('ovhManagerIplbFrontendsEdit', editComponent)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
