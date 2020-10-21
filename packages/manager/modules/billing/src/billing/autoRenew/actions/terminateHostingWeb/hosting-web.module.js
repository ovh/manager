import component from './hosting-web.component';
import routing from './hosting-web.routing';

import terminate from '../terminate/terminate.module';

const moduleName = 'ovhManagerBillingAutorenewTerminateHostingWeb';

angular
  .module(moduleName, ['ui.router', terminate])
  .config(routing)
  .component('billingAutorenewTerminateHostingWeb', component);

export default moduleName;
