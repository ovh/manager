import component from './confirm-terminate.component';
import service from './billing-confirmTerminate.service';
import routing from './termination.routing';

import legacyService from './legacy/termination-legacy.service';

const moduleName = 'ovhManagerBillingTermination';

angular
  .module(moduleName, ['ui.router'])
  .config(routing)
  .service('BillingTerminate', service)
  .service('BillingTerminateLegacy', legacyService)
  .component('billingConfirmTermination', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
