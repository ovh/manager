import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';
import '@uirouter/angularjs';

import movements from './movements/billing-payment-vouchers-movements.module';
import routing from './billing-payment-voucher.routes';
import service from './billing-vouchers.service';

const moduleName = 'ovhManagerBillingPaymentVouchers';

angular
  .module(moduleName, [
    movements,
    'ngTranslateAsyncLoader',
    'oui',
    'pascalprecht.translate',
    'ui.router',
  ])
  .config(routing)
  .service('BillingVouchers', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
