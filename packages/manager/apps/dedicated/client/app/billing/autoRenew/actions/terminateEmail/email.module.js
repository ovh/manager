import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';

import component from './email.component';
import routing from './email.routing';

import terminate from '../terminate/terminate.module';

const moduleName = 'ovhManagerBillingAutorenewTerminateEmail';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'oui',
    'pascalprecht.translate',
    terminate,
    'ui.router',
  ])
  .config(routing)
  .component('billingAutorenewTerminateEmail', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
