import component from './activation.component';
import routing from './activation.routing';

const moduleName = 'ovhManagerBillingAutorenewActivation';

angular
  .module(moduleName, ['ui.router'])
  .config(routing)
  .component('billingAutorenewActivation', component);

export default moduleName;
