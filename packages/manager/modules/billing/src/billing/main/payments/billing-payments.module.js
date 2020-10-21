import angular from 'angular';

import '@ovh-ux/manager-core';
import 'angular-translate';
import 'ovh-api-services';
import '@ovh-ux/ui-kit';

import billingHistoryRequestCtrl from './request/billing-payments-request.controller';
import billingHistoryRouting from './request/billing-payments-request.routes';
import paymentController from './billing-payments.controller';
import paymentDetailController from './details/billing-payments-details.controller';
import paymentDetailRouting from './details/billing-payments-details.routes';
import routing from './billing-payments.routes';
import service from './billing-payments.service';

const moduleName = 'ovhManagerBillingPayments';

angular
  .module(moduleName, [
    'oui',
    'ovhManagerCore',
    'ovh-api-services',
    'pascalprecht.translate',
  ])
  .config(routing)
  .config(paymentDetailRouting)
  .config(billingHistoryRouting)
  .controller('Billing.PaymentsCtrl', paymentController)
  .controller('Billing.PaymentDetailsCtrl', paymentDetailController)
  .controller('BillingHistoryRequestCtrl', billingHistoryRequestCtrl)
  .service('BillingPayments', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
