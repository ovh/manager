import component from './warnNicBilling.component';
import routing from './warnNicBilling.routing';

const moduleName = 'ovhManagerBillingAutorenewWarnNicBilling';

angular
  .module(moduleName, ['ui.router'])
  .config(routing)
  .component('billingAutorenewWarnNicBilling', component);

export default moduleName;
