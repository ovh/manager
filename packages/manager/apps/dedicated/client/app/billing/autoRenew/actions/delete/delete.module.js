import component from './delete.component';
import routing from './delete.routing';

const moduleName = 'ovhManagerBillingAutorenewDelete';

angular
  .module(moduleName, ['ui.router'])
  .config(routing)
  .component('billingAutorenewDelete', component);

export default moduleName;
