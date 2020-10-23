import angular from 'angular';

import routing from './billing-payment-refunds.routes';
import service from './billing-refunds.service';
import controller from './billing-refunds.controller';

const moduleName = 'ovhBillingPaymentRefund';

angular
  .module(moduleName, [])
  .config(routing)
  .controller('Billing.controllers.Refunds', controller)
  .service('BillingRefunds', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
