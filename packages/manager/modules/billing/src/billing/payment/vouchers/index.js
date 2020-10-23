import angular from 'angular';

import routing from './billing-payment-voucher.routes';
import service from './billing-vouchers.service';
import controller from './billing-vouchers.controller';

import movementsRouting from './movements/billing-payment-vouchers-movements.routes';
import movementsController from './movements/billing-vouchers-movements.controller';

const moduleName = 'ovhBillingPaymentVouchers';

angular
  .module(moduleName, [])
  .config(routing)
  .controller('Billing.controllers.Vouchers', controller)
  .config(movementsRouting)
  .controller('Billing.controllers.Vouchers.Movements', movementsController)
  .service('BillingVouchers', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
