import angular from 'angular';
import ngTranslate from 'angular-translate';

import 'ovh-api-services';

import paymentMethodProvider from './payment-method.provider';

const ovhAngularPaymentMethod = angular
  .module('ovh-angular-payment-method', [
    'ovh-api-services',
    ngTranslate,
  ])
  .run(/* @ngTranslationsInject ./translations */)
  .provider('ovhPaymentMethod', paymentMethodProvider)
  .name;

export default ovhAngularPaymentMethod;
