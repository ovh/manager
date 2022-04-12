import angular from 'angular';

import '@uirouter/angularjs';

import routing from './new.routing';
import component from './new.component';
import service from './new.service';

const moduleName = 'ovhManagerNashaNew';

angular
  .module(moduleName, ['ui.router'])
  .component('nashaNew', component)
  .service('NashaOrderService', service)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
