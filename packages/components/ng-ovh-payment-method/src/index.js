import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/manager-core';

import 'ovh-api-services';

import components from './components';
import paymentMethod from './payment-method.service';
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
    'ovh-api-services',
    'pascalprecht.translate',
    'ovhManagerCore',
  ])
  .run(/* @ngTranslationsInject ./translations */)
  .constant('OVH_PAYMENT_MEAN_STATUS', PAYMENT_MEAN_STATUS_ENUM)
  .constant('OVH_PAYMENT_METHOD_STATUS', PAYMENT_METHOD_STATUS_ENUM)
  .constant('OVH_PAYMENT_METHOD_TYPE', PAYMENT_METHOD_TYPE_ENUM)
  .constant('OVH_PAYMENT_METHOD_INTEGRATION_TYPE', TYPE_INTEGRATION_ENUM)
  .service('ovhPaymentMethod', paymentMethod)
  .service('ovhPaymentMethodHelper', paymentMethodHelperService);

export default moduleName;
