import component from './confirm-terminate.component';
import service from './billing-confirmTerminate.service';
import routing from './termination.routing';

const moduleName = 'ovhManagerBillingTermination';

angular
  .module(moduleName, ['ui.router'])
  .config(routing)
  .service('BillingTerminate', service)
  .component('billingConfirmTermination', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
