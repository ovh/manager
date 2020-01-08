import component from './terminate-enterprise-cloud-database.component';
import routing from './terminate-enterprise-cloud-database.routing';

import terminate from '../terminate/terminate.module';

const moduleName = 'ovhManagerBillingAutorenewTerminateEnterpriseCloudDatabase';

angular
  .module(moduleName, ['ui.router', terminate])
  .config(routing)
  .component('billingAutorenewTerminateEnterpriseCloudDatabase', component);

export default moduleName;
