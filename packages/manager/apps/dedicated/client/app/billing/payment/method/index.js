import angular from 'angular';

import 'angular-translate';
import '@ovh-ux/ui-kit';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ng-ovh-payment-method';
import managerBilling from '@ovh-ux/manager-billing';

import addModule from './add';
import defaultModule from './default';
import deleteModule from './delete';
import editModule from './edit';

import activateSplitPayment from './splitPayment/activate';
import deactivateSplitPayment from './splitPayment/deactivate';

import routing from './routing';
import component from './component';

const moduleName = 'ovhBillingPaymentMethod';

angular
  .module(moduleName, [
    'oui',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ngOvhPaymentMethod',
    activateSplitPayment,
    addModule,
    deactivateSplitPayment,
    defaultModule,
    deleteModule,
    editModule,
    managerBilling,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */)
  .component(component.name, component);

export default moduleName;
