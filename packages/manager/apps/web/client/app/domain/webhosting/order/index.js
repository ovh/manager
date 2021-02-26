import ovhManagerOrder from '@ovh-ux/manager-order';

import steps from './steps';

import component from './domain-webhosting-order.component';
import routing from './domain-webhosting-order.routing';
import service from './domain-webhosting-order.service';

const moduleName = 'ovhManagerWebDomainWebhostingOrderModule';

angular
  .module(moduleName, [ovhManagerOrder, steps])
  .component(component.name, component)
  .service('WebHostingOrder', service)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
