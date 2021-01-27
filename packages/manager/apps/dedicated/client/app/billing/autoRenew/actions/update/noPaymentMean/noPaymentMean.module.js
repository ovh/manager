import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';

import component from './noPaymentMean.component';

const moduleName = 'ovhManagerBillingAutorenewUpdateWithoutPaymentMean';

angular
  .module(moduleName, ['ngTranslateAsyncLoader', 'pascalprecht.translate'])
  .component('billingAutorenewUpdateWithoutPaymentMean', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
