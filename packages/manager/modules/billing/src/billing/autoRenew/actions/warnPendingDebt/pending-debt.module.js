import component from './pending-debt.component';
import routing from './pending-debt.routing';

const moduleName = 'ovhManagerBillingAutorenewWarnPendingDebt';

angular
  .module(moduleName, ['ui.router'])
  .config(routing)
  .component('billingAutorenewWarnPendingDebt', component);

export default moduleName;
