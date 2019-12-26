import bulk from '../bulk/bulk.module';

import component from './disable.component';
import routing from './disable.routing';
import service from './disable.service';

const moduleName = 'ovhManagerBillingAutorenewDisable';

angular
  .module(moduleName, ['ui.router', bulk])
  .config(routing)
  .component('billingAutorenewDisable', component)
  .service('BillingAutorenewDisable', service);

export default moduleName;
