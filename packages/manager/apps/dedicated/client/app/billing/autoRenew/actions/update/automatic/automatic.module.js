import angular from 'angular';
import angularTranslate from 'angular-translate';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';

import component from './automatic.component';

const moduleName = 'ovhManagerBillingAutorenewUpdateAutomatic';

angular
  .module(moduleName, [angularTranslate, ngTranslateAsyncLoader])
  .component('billingAutorenewUpdateAutomatic', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
