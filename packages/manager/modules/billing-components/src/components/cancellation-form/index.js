import component from './confirm-terminate.component';
import service from './billing-confirmTerminate.service';

const moduleName = 'ovhManagerBillingCancellationForm';

angular
  .module(moduleName, ['ui.router'])
  .service('BillingTerminate', service)
  .component('billingConfirmTermination', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
