import angular from 'angular';

import angularTranslate from 'angular-translate';
import '@ovh-ux/ui-kit';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import ngOvhPaymentMethod from '@ovh-ux/ng-ovh-payment-method';
import ovhManagerCore from '@ovh-ux/manager-core';

import routing from './routing';
import component from './component';

import billingContactViewModule from './views/billingContact';
import bankAccountViewModule from './views/bankAccount';
import legacyBillingAddressViewModule from './views/legacyBillingAddress';

const moduleName = 'ovhBillingPaymentMethodAdd';

angular
  .module(moduleName, [
    angularTranslate,
    'oui',
    ngTranslateAsyncLoader,
    ngOvhPaymentMethod,
    ovhManagerCore,
    billingContactViewModule,
    bankAccountViewModule,
    legacyBillingAddressViewModule,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */)
  .component(component.name, component);

export default moduleName;
