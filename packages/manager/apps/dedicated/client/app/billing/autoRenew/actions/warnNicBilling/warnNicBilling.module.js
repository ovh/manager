import angular from 'angular';
import angularTranslate from 'angular-translate';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';
import uiRouter from '@uirouter/angularjs';

import component from './warnNicBilling.component';
import routing from './warnNicBilling.routing';

const moduleName = 'ovhManagerBillingAutorenewWarnNicBilling';

angular
  .module(moduleName, [
    angularTranslate,
    ngTranslateAsyncLoader,
    'oui',
    uiRouter,
  ])
  .config(routing)
  .component('billingAutorenewWarnNicBilling', component);

export default moduleName;
