import angular from 'angular';
import '@uirouter/angularjs';

import routing from './confirm-terminate.routing';
import confirmTerminate from './confirm-terminate.component';

const moduleName = 'domainAnycastConfirmTerminate';

angular
  .module(moduleName, ['ui.router'])
  .config(routing)
  .component('domainAnycastConfirmTerminate', confirmTerminate)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
