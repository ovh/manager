import retraction from './retraction/retraction.module';
import billingOrdersService from './billing-orders.service';
import billingOrdersServiceApiv7 from './billing-orders-apiv7.service';
import billingOrderStatusEnumService from './billing-orders-statusEnum.service';
import billingOrdersStatusFiltersService from './billing-orders-statusFilters.service';

import routing from './orders.routing';

const moduleName = 'ovhManagerBillingOrders';

angular
  .module(moduleName, ['ui.router', retraction])
  .config(routing)
  .service('BillingOrders', billingOrdersService)
  .service('BillingOrdersApiv7', billingOrdersServiceApiv7)
  .service('BillingOrderStatusEnum', billingOrderStatusEnumService)
  .service('BillingOrdersStatusFilters', billingOrdersStatusFiltersService);

export default moduleName;
