import angular from 'angular';
import angularTranslate from 'angular-translate';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';
import uiRouter from '@uirouter/angularjs';

import component from './email.component';
import routing from './email.routing';

import terminate from '../terminate/terminate.module';

const moduleName = 'ovhManagerBillingAutorenewTerminateEmail';

angular
  .module(moduleName, [
    angularTranslate,
    ngTranslateAsyncLoader,
    'oui',
    terminate,
    uiRouter,
  ])
  .config(routing)
  .component('billingAutorenewTerminateEmail', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
