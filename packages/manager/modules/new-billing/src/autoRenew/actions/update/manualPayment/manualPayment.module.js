import angular from 'angular';
import angularTranslate from 'angular-translate';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';

import component from './manualPayment.component';

const moduleName = 'ovhManagerBillingAutorenewUpdateManualPayment';

angular
  .module(moduleName, [angularTranslate, ngTranslateAsyncLoader])
  .component('billingAutorenewUpdateManualPayment', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
