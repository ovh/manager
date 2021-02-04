import angular from 'angular';
import angularTranslate from 'angular-translate';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import uiRouter from '@uirouter/angularjs';

import bulk from '../bulk/bulk.module';

import component from './disable.component';
import routing from './disable.routing';
import service from './disable.service';

const moduleName = 'ovhManagerBillingAutorenewDisable';

angular
  .module(moduleName, [
    angularTranslate,
    bulk,
    ngTranslateAsyncLoader,
    uiRouter,
  ])
  .config(routing)
  .component('billingAutorenewDisable', component)
  .service('BillingAutorenewDisable', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
