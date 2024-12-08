import angular from 'angular';
import angularTranslate from 'angular-translate';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';
import uiRouter from '@uirouter/angularjs';

import component from './disable-domains-bulk.component';
import routing from './disable-domains-bulk.routing';

const moduleName = 'ovhManagerBillingAutorenewDisableDomainsBulk';

angular
  .module(moduleName, [
    angularTranslate,
    ngTranslateAsyncLoader,
    'oui',
    uiRouter,
  ])
  .config(routing)
  .component('billingAutorenewDisableDomainsBulk', component);

export default moduleName;
