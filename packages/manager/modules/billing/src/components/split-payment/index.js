import angular from 'angular';
import angularTranslate from 'angular-translate';
import '@ovh-ux/ui-kit';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';

import actionComponent from './action/component';
import component from './component';

const moduleName = 'ovhManagerBillingSplitPayment';

angular
  .module(moduleName, [angularTranslate, ngTranslateAsyncLoader, 'oui'])
  .component('ovhManagerBillingSplitPayment', component)
  .component('ovhManagerBillingSplitPaymentAction', actionComponent)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
