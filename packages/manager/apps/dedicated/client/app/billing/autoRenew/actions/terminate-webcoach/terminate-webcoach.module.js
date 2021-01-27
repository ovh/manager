import angular from 'angular';
import angularTranslate from 'angular-translate';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';
import uiRouter from '@uirouter/angularjs';

import component from './terminate-webcoach.component';
import routing from './terminate-webcoach.routing';

import terminate from '../terminate/terminate.module';

const moduleName = 'ovhManagerBillingAutorenewTerminateWebCoach';

angular
  .module(moduleName, [
    angularTranslate,
    ngTranslateAsyncLoader,
    'oui',
    terminate,
    uiRouter,
  ])
  .config(routing)
  .component('billingAutorenewTerminateWebCoach', component);

export default moduleName;
