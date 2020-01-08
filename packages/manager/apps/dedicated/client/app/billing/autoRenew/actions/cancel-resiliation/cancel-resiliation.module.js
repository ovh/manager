import component from './cancel-resiliation.component';
import routing from './cancel-resiliation.routing';

const moduleName = 'ovhManagerBillingAutorenewCancelResiliation';

angular
  .module(moduleName, ['ui.router'])
  .config(routing)
  .component('billingAutorenewCancelResiliation', component);

export default moduleName;
