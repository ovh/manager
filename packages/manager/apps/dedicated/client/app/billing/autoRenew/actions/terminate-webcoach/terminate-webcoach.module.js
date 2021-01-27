import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';

import component from './terminate-webcoach.component';
import routing from './terminate-webcoach.routing';

import terminate from '../terminate/terminate.module';

const moduleName = 'ovhManagerBillingAutorenewTerminateWebCoach';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'oui',
    'pascalprecht.translate',
    terminate,
    'ui.router',
  ])
  .config(routing)
  .component('billingAutorenewTerminateWebCoach', component);

export default moduleName;
