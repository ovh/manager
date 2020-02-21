import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/manager-core';

import components from './components';
import paymentMethodProvider from './payment-method.provider';
import paymentMethodHelperService from './payment-method-helper.service';

import {
  PAYMENT_METHOD_STATUS_ENUM,
  PAYMENT_METHOD_TYPE_ENUM,
  TYPE_INTEGRATION_ENUM,
} from './payment-method.constants';
import { PAYMENT_MEAN_STATUS_ENUM } from './legacy/mean/payment-mean.constants';

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
  .constant('OVH_PAYMENT_METHOD_TYPE', PAYMENT_METHOD_TYPE_ENUM)
  .constant('OVH_PAYMENT_METHOD_INTEGRATION_TYPE', TYPE_INTEGRATION_ENUM)
  .provider('ovhPaymentMethod', paymentMethodProvider)
  .service('ovhPaymentMethodHelper', paymentMethodHelperService);

export default moduleName;
