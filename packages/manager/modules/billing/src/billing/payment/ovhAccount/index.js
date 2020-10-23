import angular from 'angular';

import routing from './billing-payment-ovhAccount.routes';
import service from './billing-ovhAccount.service';
import controller from './billing-ovhAccount.controller';
import createAlertController from './createAlert/billing-ovhAccount-createAlert.controller';
import renewController from './renew/billing-ovhAccount-renew.controller';
import retrieveController from './retrieve/billing-ovhAccount-retrieve.controller';

import createAlert from './createAlert/billing-ovhAccount-createAlert.html';
import renew from './renew/billing-ovhAccount-renew.html';
import retrieve from './retrieve/billing-ovhAccount-retrieve.html';

const moduleName = 'ovhBillingPaymentOvhAccount';

angular
  .module(moduleName, [])
  .config(routing)
  .controller('Billing.controllers.OvhAccount', controller)
  .controller(
    'Billing.controllers.OvhAccountCreateAlert',
    createAlertController,
  )
  .controller('Billing.controllers.OvhAccountRenew', renewController)
  .controller('Billing.controllers.OvhAccountRetrieve', retrieveController)
  .service('BillingOvhAccount', service)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        'billing/payment/ovhAccount/createAlert/billing-ovhAccount-createAlert.html',
        createAlert,
      );
      $templateCache.put(
        'billing/payment/ovhAccount/renew/billing-ovhAccount-renew.html',
        renew,
      );
      $templateCache.put(
        'billing/payment/ovhAccount/retrieve/billing-ovhAccount-retrieve.html',
        retrieve,
      );
    },
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
