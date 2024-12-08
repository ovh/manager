import angular from 'angular';
import angularTranslate from 'angular-translate';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import uiRouter from '@uirouter/angularjs';

import bulk from '../bulk/bulk.module';

import component from './enable.component';
import routing from './enable.routing';
import service from './enable.service';

const moduleName = 'ovhManagerBillingAutorenewEnable';

angular
  .module(moduleName, [
    angularTranslate,
    bulk,
    ngTranslateAsyncLoader,
    uiRouter,
  ])
  .config(routing)
  .component('billingAutorenewEnable', component)
  .service('BillingAutorenewEnable', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
