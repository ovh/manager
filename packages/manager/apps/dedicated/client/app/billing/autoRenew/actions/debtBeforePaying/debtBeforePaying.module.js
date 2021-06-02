import angular from 'angular';
import angularTranslate from 'angular-translate';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';
import uiRouter from '@uirouter/angularjs';

import component from './debtBeforePaying.component';
import routing from './debtBeforePaying.routing';

const moduleName = 'ovhManagerBillingAutorenewDebtBeforePaying';

angular
  .module(moduleName, [
    angularTranslate,
    ngTranslateAsyncLoader,
    'oui',
    uiRouter,
  ])
  .config(routing)
  .component('billingAutorenewDebtBeforePaying', component);

export default moduleName;
