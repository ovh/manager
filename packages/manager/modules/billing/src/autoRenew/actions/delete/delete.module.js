import angular from 'angular';
import angularTranslate from 'angular-translate';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';
import uiRouter from '@uirouter/angularjs';

import billingComponents from '@ovh-ux/manager-billing-components';
import component from './delete.component';
import routing from './delete.routing';

const moduleName = 'ovhManagerBillingAutorenewDelete';

angular
  .module(moduleName, [
    angularTranslate,
    billingComponents,
    ngTranslateAsyncLoader,
    'oui',
    uiRouter,
  ])
  .config(routing)
  .component('billingAutorenewDelete', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
