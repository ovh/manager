import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';

import component from './private-database.component';
import routing from './private-database.routing';

const moduleName = 'ovhManagerBillingAutorenewTerminatePrivateDatabase';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'oui',
    'pascalprecht.translate',
    'ui.router',
  ])
  .config(routing)
  .component('billingAutorenewTerminatePrivateDatabase', component);

export default moduleName;
