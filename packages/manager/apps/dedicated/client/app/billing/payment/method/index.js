import angular from 'angular';

import angularTranslate from 'angular-translate';
import '@ovh-ux/ui-kit';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import ngOvhPaymentMethod from '@ovh-ux/ng-ovh-payment-method';
import managerBillingComponents from '@ovh-ux/manager-billing-components';

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
    angularTranslate,
    'oui',
    ngTranslateAsyncLoader,
    ngOvhPaymentMethod,
    activateSplitPayment,
    addModule,
    deactivateSplitPayment,
    defaultModule,
    deleteModule,
    editModule,
    managerBillingComponents,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */)
  .component(component.name, component);

export default moduleName;
