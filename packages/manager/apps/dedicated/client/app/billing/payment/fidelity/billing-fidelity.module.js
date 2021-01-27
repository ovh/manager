import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';
import '@uirouter/angularjs';

import routing from './billing-payment-fidelity.routes';
import service from './billing-fidelity.service';
import creditOrderCtrl from './creditOrder/billing-fidelity-creditOrder.controller';
import creditOrderTpl from './creditOrder/billing-fidelity-creditOrder.html';

const moduleName = 'ovhManagerBillingPaymentFidelity';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'oui',
    'pascalprecht.translate',
    'ui.router',
  ])
  .config(routing)
  .controller('Billing.controllers.FidelityCreditOrder', creditOrderCtrl)
  .service('BillingFidelity', service)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'billing/payment/fidelity/creditOrder/billing-fidelity-creditOrder.html',
        creditOrderTpl,
      );
    },
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
