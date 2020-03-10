import angular from 'angular';
import component from './component';
import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-swimming-poll';
import '@ovh-ux/ng-ovh-api-wrappers';
import '@ovh-ux/ng-ovh-payment-method';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';

import './index.scss';

const moduleName = 'ovhManagerHubPaymentMean';

angular
  .module(moduleName, [
    'ngOvhSwimmingPoll',
    'ngOvhApiWrappers',
    'ngOvhPaymentMethod',
    'ngTranslateAsyncLoader',
    'oui',
    'ovh-api-services',
    'ovhManagerCore',
    'pascalprecht.translate',
  ])
  .component('ovhManagerHubPaymentMean', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
