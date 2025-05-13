import angular from 'angular';
import angularTranslate from 'angular-translate';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';
import uiRouter from '@uirouter/angularjs';

import component from './bulk.component';

const moduleName = 'ovhManagerBillingAutorenewBulk';

angular
  .module(moduleName, [
    angularTranslate,
    ngTranslateAsyncLoader,
    'oui',
    uiRouter,
  ])
  .component('billingAutorenewBulk', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
