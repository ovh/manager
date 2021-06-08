import angular from 'angular';
import angularTranslate from 'angular-translate';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';
import uiRouter from '@uirouter/angularjs';

import credits from './credits/billing-credits.module';
import fidelity from './fidelity/billing-fidelity.module';
import method from './method';
import ovhAccount from './ovhAccount/billing-ovhAccount.module';
import vouchers from './vouchers/billing-payment-voucher.module';

import routing from './billing-payment.routes';

const moduleName = 'ovhManagerBillingPayment';

angular
  .module(moduleName, [
    angularTranslate,
    ngTranslateAsyncLoader,
    credits,
    fidelity,
    method,
    'oui',
    ovhAccount,
    uiRouter,
    vouchers,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
