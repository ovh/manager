import angular from 'angular';

import routing from './billing-payment-credits.routes';
import service from './billing-credits.service';
import movementRouting from './movements/billing-payment-credits-movements.routes';

const moduleName = 'ovhBillingPaymentCredits';

angular
  .module(moduleName, [])
  .config(routing)
  .config(movementRouting)
  .service('BillingCredits', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
