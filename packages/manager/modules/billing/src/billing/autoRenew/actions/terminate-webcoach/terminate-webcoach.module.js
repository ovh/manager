import component from './terminate-webcoach.component';
import routing from './terminate-webcoach.routing';

import terminate from '../terminate/terminate.module';

const moduleName = 'ovhManagerBillingAutorenewTerminateWebCoach';

angular
  .module(moduleName, ['ui.router', terminate])
  .config(routing)
  .component('billingAutorenewTerminateWebCoach', component);

export default moduleName;
