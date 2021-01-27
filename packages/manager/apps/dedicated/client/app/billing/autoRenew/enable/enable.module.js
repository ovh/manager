import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';

import bulk from '../bulk/bulk.module';

import component from './enable.component';
import routing from './enable.routing';
import service from './enable.service';

const moduleName = 'ovhManagerBillingAutorenewEnable';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ui.router',
    bulk,
  ])
  .config(routing)
  .component('billingAutorenewEnable', component)
  .service('BillingAutorenewEnable', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
