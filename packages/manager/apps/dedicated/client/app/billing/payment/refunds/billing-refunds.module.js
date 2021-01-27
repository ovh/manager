import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';
import '@uirouter/angularjs';

import routing from './billing-payment-refunds.routes';
import service from './billing-refunds.service';

const moduleName = 'ovhManagerBillingPaymentRefund';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'oui',
    'pascalprecht.translate',
    'ui.router',
  ])
  .config(routing)
  .service('BillingRefunds', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
