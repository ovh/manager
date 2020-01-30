import component from './disable-domains-bulk.component';
import routing from './disable-domains-bulk.routing';

const moduleName = 'ovhManagerBillingAutorenewDisableDomainsBulk';

angular
  .module(moduleName, [])
  .config(routing)
  .component('billingAutorenewDisableDomainsBulk', component);

export default moduleName;
