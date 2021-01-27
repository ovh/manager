import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import '@uirouter/angularjs';

import routing from './billing-payment-vouchers-movements.routes';

const moduleName = 'ovhManagerBillingPaymentVouchersMovements';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate', 'ui.router'])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
