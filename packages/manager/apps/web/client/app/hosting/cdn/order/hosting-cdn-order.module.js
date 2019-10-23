import component from './hosting-cdn-order.component';
import routing from './hosting-cdn-order.routing';
import service from './hosting-cdn-order.service';

const moduleName = 'ovhManagerHostingCdnOrder';

angular
  .module(moduleName, [])
  .component('hostingCdnOrder', component)
  .service('HostingCdnOrderService', service)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
