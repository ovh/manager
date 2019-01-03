import angular from 'angular';
import ngTranslate from 'angular-translate';

import 'ovh-api-services';

import paymentMethodProvider from './payment-method.provider';
import paymentMethodHelperService from './payment-method-helper.service';

const moduleName = 'ovh-angular-payment-method';

angular
  .module(moduleName, [
    'ovh-api-services',
    ngTranslate,
  ])
  .run(/* @ngTranslationsInject ./translations */)
  .provider('ovhPaymentMethod', paymentMethodProvider)
  .service('ovhPaymentMethodHelper', paymentMethodHelperService);

export default moduleName;
