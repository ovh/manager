import angular from 'angular';
import '@uirouter/angularjs';

import routing from './routing';

const moduleName = 'ovhManagerSmsBatchesPendingCancel';

angular
  .module(moduleName, [])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
