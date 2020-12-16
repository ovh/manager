import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-payment-method';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ng-at-internet';

import component from './cancel-resiliation.component';

const moduleName = 'ovhManagerBillingCancelResiliation';

angular
  .module(moduleName, [
    'ovhManagerCore',
    'oui',
    'ngAtInternet',
    'pascalprecht.translate',
    'ui.router',
    'ngOvhPaymentMethod',
    'ngTranslateAsyncLoader',
    'ovhManagerCore',
  ])
  .component('billingCancelResiliation', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
