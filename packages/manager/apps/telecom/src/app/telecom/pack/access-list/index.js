import angular from 'angular';

import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import uiRouter from '@uirouter/angularjs';
import angularTranslate from 'angular-translate';

import component from './xdsl-access-list.component';
import routing from './xdsl-access-list.routing';
import service from './xdsl-access-list.service';

const moduleName = 'ovhManagerTelecomXdslAccessList';

angular
  .module(moduleName, [ngTranslateAsyncLoader, uiRouter, angularTranslate])
  .component('xdslAccessList', component)
  .service('XdslAccessListService', service)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
