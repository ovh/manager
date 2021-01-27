import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';
import '@uirouter/angularjs';

import component from './pending-debt.component';
import routing from './pending-debt.routing';

const moduleName = 'ovhManagerBillingAutorenewWarnPendingDebt';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'oui',
    'pascalprecht.translate',
    'ui.router',
  ])
  .config(routing)
  .component('billingAutorenewWarnPendingDebt', component);

export default moduleName;
