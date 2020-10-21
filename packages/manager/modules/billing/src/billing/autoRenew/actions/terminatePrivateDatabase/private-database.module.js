import component from './private-database.component';
import routing from './private-database.routing';

const moduleName = 'ovhManagerBillingAutorenewTerminatePrivateDatabase';

angular
  .module(moduleName, ['ui.router'])
  .config(routing)
  .component('billingAutorenewTerminatePrivateDatabase', component);

export default moduleName;
