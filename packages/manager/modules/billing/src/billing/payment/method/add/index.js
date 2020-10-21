import angular from 'angular';

import 'angular-translate';
import '@ovh-ux/ui-kit';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ng-ovh-payment-method';
import '@ovh-ux/manager-core';

import routing from './routing';
import component from './component';

import billingContactViewModule from './views/billingContact';
import legacyBankAccountViewModule from './views/legacyBankAccount';
import legacyBillingAddressViewModule from './views/legacyBillingAddress';

const moduleName = 'ovhBillingPaymentMethodAdd';

angular
  .module(moduleName, [
    'oui',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ngOvhPaymentMethod',
    'ovhManagerCore',
    billingContactViewModule,
    legacyBankAccountViewModule,
    legacyBillingAddressViewModule,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */)
  .component(component.name, component);

export default moduleName;
