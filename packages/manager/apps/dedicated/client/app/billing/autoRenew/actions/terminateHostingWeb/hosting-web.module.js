import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';

import component from './hosting-web.component';
import routing from './hosting-web.routing';

import terminate from '../terminate/terminate.module';

const moduleName = 'ovhManagerBillingAutorenewTerminateHostingWeb';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'oui',
    'pascalprecht.translate',
    terminate,
    'ui.router',
  ])
  .config(routing)
  .component('billingAutorenewTerminateHostingWeb', component);

export default moduleName;
