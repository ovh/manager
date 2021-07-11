import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/manager-core';

import {
  PAYMENT_MEAN_STATUS_ENUM,
  PAYMENT_METHOD_STATUS_ENUM,
  AVAILABLE_PAYMENT_METHOD_TYPE_ENUM,
  AVAILABLE_PAYMENT_METHOD_INTEGRATION_ENUM,
} from '@ovh-ux/ovh-payment-method';

import components from './components';
import paymentMethodProvider from './payment-method.provider';
import paymentMethodHelperService from './payment-method-helper.service';

const moduleName = 'ngOvhPaymentMethod';

angular
  .module(moduleName, [
    components,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ovhManagerCore',
  ])
  .run(/* @ngTranslationsInject:json ./translations */)
  .constant('OVH_PAYMENT_MEAN_STATUS', PAYMENT_MEAN_STATUS_ENUM)
  .constant('OVH_PAYMENT_METHOD_STATUS', PAYMENT_METHOD_STATUS_ENUM)
  .constant('OVH_PAYMENT_METHOD_TYPE', AVAILABLE_PAYMENT_METHOD_TYPE_ENUM)
  .constant(
    'OVH_PAYMENT_METHOD_INTEGRATION_TYPE',
    AVAILABLE_PAYMENT_METHOD_INTEGRATION_ENUM,
  )
  .provider('ovhPaymentMethod', paymentMethodProvider)
  .service('ovhPaymentMethodHelper', paymentMethodHelperService);

export default moduleName;
