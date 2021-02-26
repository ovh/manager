import ovhManagerOrder from '@ovh-ux/manager-order';

import component from './hosting-cdn-order.component';
import routing from './hosting-cdn-order.routing';
import service from './hosting-cdn-order.service';

const moduleName = 'ovhManagerHostingCdnOrder';

angular
  .module(moduleName, [ovhManagerOrder])
  .component('hostingCdnOrder', component)
  .service('HostingCdnOrderService', service)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
