import component from './debtBeforePaying.component';
import routing from './debtBeforePaying.routing';

const moduleName = 'ovhManagerBillingAutorenewDebtBeforePaying';

angular
  .module(moduleName, ['ui.router'])
  .config(routing)
  .component('billingAutorenewDebtBeforePaying', component);

export default moduleName;
