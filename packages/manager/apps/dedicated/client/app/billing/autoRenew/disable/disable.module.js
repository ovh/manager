import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import bulk from '../bulk/bulk.module';

import component from './disable.component';
import routing from './disable.routing';
import service from './disable.service';

const moduleName = 'ovhManagerBillingAutorenewDisable';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ui.router',
    bulk,
  ])
  .config(routing)
  .component('billingAutorenewDisable', component)
  .service('BillingAutorenewDisable', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
