import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';

import 'ovh-api-services';

import paymentMethodProvider from './payment-method.provider';
import paymentMethodHelperService from './payment-method-helper.service';
import availableComponent from './availableTypes/availableTypes.component';

const moduleName = 'ngOvhPaymentMethod';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'ovh-api-services',
    'pascalprecht.translate',
  ])
  .run(/* @ngTranslationsInject ./translations */)
  .provider('ovhPaymentMethod', paymentMethodProvider)
  .service('ovhPaymentMethodHelper', paymentMethodHelperService)
  .component('ovhPaymentMethodAvailableTypes', availableComponent);

export default moduleName;
