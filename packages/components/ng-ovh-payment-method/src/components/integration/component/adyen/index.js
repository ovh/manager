import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';

import '@ovh-ux/ui-kit';
import './index.less';

import component from './component';
import ADYEN_CONSTANTS from './constants';

const moduleName = 'ngOvhPaymentMethodIntegrationComponentAdyen';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'oui',
  ])
  .component('ovhPaymentMethodIntegrationComponentAdyen', component)
  .constant('OVH_PAYMENT_ADYEN_CONSTANTS', ADYEN_CONSTANTS)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
