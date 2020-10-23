import routing from './sla.routing';
import service from './billing-sla.service';
import controller from './billing-sla.controller';

const moduleName = 'ovhManagerBillingSla';

angular
  .module(moduleName, ['ui.router'])
  .config(routing)
  .controller('Billing.controllers.Sla', controller)
  .service('BillingSla', service);

export default moduleName;
