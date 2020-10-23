import angular from 'angular';

import routing from './billing-payment-fidelity.routes';
import service from './billing-fidelity.service';
import creditOrderController from './creditOrder/billing-fidelity-creditOrder.controller';
import creditOrder from './creditOrder/billing-fidelity-creditOrder.html';
import controller from './billing-fidelity.controller';

const moduleName = 'ovhBillingPaymentFidelity';

angular
  .module(moduleName, [])
  .config(routing)
  .controller('Billing.controllers.FidelityCreditOrder', creditOrderController)
  .controller('Billing.controllers.Fidelity', controller)
  .service('BillingFidelity', service)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'billing/payment/fidelity/creditOrder/billing-fidelity-creditOrder.html',
        creditOrder,
      );
    },
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
