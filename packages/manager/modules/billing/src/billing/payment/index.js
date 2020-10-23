import angular from 'angular';

import 'angular-translate';
import '@ovh-ux/ui-kit';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ng-ovh-payment-method';

import credits from './credits';
import fidelity from './fidelity';
import paymentMehtod from './method';
import ovhAccount from './ovhAccount';
import refunds from './refunds';
import transactions from './transactions';
import vouchers from './vouchers';

import routing from './billing-payment.routes';

const moduleName = 'ovhBillingPayment';

angular
  .module(moduleName, [
    'oui',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ngOvhPaymentMethod',
    credits,
    fidelity,
    paymentMehtod,
    ovhAccount,
    refunds,
    transactions,
    vouchers,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
