import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';

import component from './manualPayment.component';

const moduleName = 'ovhManagerBillingAutorenewUpdateManualPayment';

angular
  .module(moduleName, ['ngTranslateAsyncLoader', 'pascalprecht.translate'])
  .component('billingAutorenewUpdateManualPayment', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
