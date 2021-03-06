import angular from 'angular';
import angularTranslate from 'angular-translate';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';
import uiRouter from '@uirouter/angularjs';

import movements from './movements/billing-payment-vouchers-movements.module';
import routing from './billing-payment-voucher.routes';
import service from './billing-vouchers.service';

const moduleName = 'ovhManagerBillingPaymentVouchers';

angular
  .module(moduleName, [
    angularTranslate,
    movements,
    ngTranslateAsyncLoader,
    'oui',
    uiRouter,
  ])
  .config(routing)
  .service('BillingVouchers', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
