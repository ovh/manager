import vpsOutperformBanner from '../vps-outperform-banner';
import component from './confirm-terminate.component';
import service from './billing-confirmTerminate.service';

const moduleName = 'ovhManagerBillingCancellationForm';

angular
  .module(moduleName, ['ui.router', vpsOutperformBanner])
  .service('BillingTerminate', service)
  .component('billingConfirmTermination', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
