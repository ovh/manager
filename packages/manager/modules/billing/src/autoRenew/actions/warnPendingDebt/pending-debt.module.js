import angular from 'angular';
import angularTranslate from 'angular-translate';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';
import uiRouter from '@uirouter/angularjs';

import component from './pending-debt.component';
import routing from './pending-debt.routing';

const moduleName = 'ovhManagerBillingAutorenewWarnPendingDebt';

angular
  .module(moduleName, [
    angularTranslate,
    ngTranslateAsyncLoader,
    'oui',
    uiRouter,
  ])
  .config(routing)
  .component('billingAutorenewWarnPendingDebt', component);

export default moduleName;
