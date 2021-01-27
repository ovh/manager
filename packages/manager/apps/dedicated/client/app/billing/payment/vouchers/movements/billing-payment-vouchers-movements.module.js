import angular from 'angular';
import angularTranslate from 'angular-translate';
import '@ovh-ux/ui-kit';
import uiRouter from '@uirouter/angularjs';

import routing from './billing-payment-vouchers-movements.routes';

const moduleName = 'ovhManagerBillingPaymentVouchersMovements';

angular
  .module(moduleName, [angularTranslate, 'oui', uiRouter])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
