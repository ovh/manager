import component from './hosting-cdn-order.component';
import routing from './hosting-cdn-order.routing';

const moduleName = 'ovhManagerHostingCdnOrder';

angular
  .module(moduleName, [])
  .component('hostingCdnOrder', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
