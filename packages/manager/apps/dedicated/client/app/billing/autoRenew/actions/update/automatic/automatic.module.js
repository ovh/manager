import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';

import component from './automatic.component';

const moduleName = 'ovhManagerBillingAutorenewUpdateAutomatic';

angular
  .module(moduleName, ['ngTranslateAsyncLoader', 'pascalprecht.translate'])
  .component('billingAutorenewUpdateAutomatic', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
