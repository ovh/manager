import angular from 'angular';
import angularTranslate from 'angular-translate';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';
import uiRouter from '@uirouter/angularjs';

import component from './form.component';
import service from './form.service';

const moduleName = 'ovhManagerBillingAutorenewUpdateForm';

angular
  .module(moduleName, [
    angularTranslate,
    ngTranslateAsyncLoader,
    'oui',
    uiRouter,
  ])
  .component('billingAutorenewUpdateForm', component)
  .service('BillingAutorenewUpdateForm', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
