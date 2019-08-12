import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';

import 'ovh-api-services';

import components from './components';
import paymentMethodProvider from './payment-method.provider';
import paymentMethodHelperService from './payment-method-helper.service';

const moduleName = 'ngOvhPaymentMethod';

angular
  .module(moduleName, [
    components,
    'ngTranslateAsyncLoader',
    'ovh-api-services',
    'pascalprecht.translate',
  ])
  .run(/* @ngTranslationsInject ./translations */)
  .provider('ovhPaymentMethod', paymentMethodProvider)
  .service('ovhPaymentMethodHelper', paymentMethodHelperService);

export default moduleName;
