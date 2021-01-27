import angular from 'angular';
import angularTranslate from 'angular-translate';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';
import uiRouter from '@uirouter/angularjs';

import routing from './billing-payment-ovhAccount.routes';
import service from './billing-ovhAccount.service';
import createAlertCtrl from './createAlert/billing-ovhAccount-createAlert.controller';
import createAlertTpl from './createAlert/billing-ovhAccount-createAlert.html';
import renewCtrl from './renew/billing-ovhAccount-renew.controller';
import renewTpl from './renew/billing-ovhAccount-renew.html';

const moduleName = 'ovhManagerBillingPaymentOvhAccount';

angular
  .module(moduleName, [
    angularTranslate,
    ngTranslateAsyncLoader,
    'oui',
    uiRouter,
  ])
  .config(routing)
  .service('BillingOvhAccount', service)
  .controller('Billing.controllers.OvhAccountCreateAlert', createAlertCtrl)
  .controller('Billing.controllers.OvhAccountRenew', renewCtrl)
  .run(
    /* @ngInject */ ($templateCache) => {
      $templateCache.put(
        '/billing/payment/ovhAccount/createAlert/billing-ovhAccount-createAlert.html',
        createAlertTpl,
      );
      $templateCache.put(
        '/billing/payment/ovhAccount/renew/billing-ovhAccount-renew.html',
        renewTpl,
      );
    },
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
