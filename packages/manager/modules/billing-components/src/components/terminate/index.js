import angular from 'angular';
import angularTranslate from 'angular-translate';
import ngAtInternet from '@ovh-ux/ng-at-internet';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';

import component from './terminate.component';

const moduleName = 'ovhManagerBillingComponentsAutorenewTerminate';

angular
  .module(moduleName, [
    angularTranslate,
    ngAtInternet,
    ngTranslateAsyncLoader,
    'oui',
  ])
  .component('billingAutorenewTerminate', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
