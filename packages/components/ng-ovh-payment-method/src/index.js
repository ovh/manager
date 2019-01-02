import angular from 'angular';
import ngTranslate from 'angular-translate';
import '@ovh-ux/translate-async-loader';

import 'ovh-api-services';

import paymentMethodProvider from './payment-method.provider';
import paymentMethodHelperService from './payment-method-helper.service';

const moduleName = 'ngOvhPaymentMethod';

angular
  .module(moduleName, [
    'ovh-api-services',
    ngTranslate,
    'translate-async-loader',
  ])
  .run(/* @ngTranslationsInject ./translations */)
  .provider('ovhPaymentMethod', paymentMethodProvider)
  .service('ovhPaymentMethodHelper', paymentMethodHelperService);

export default moduleName;
