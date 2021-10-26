import ovhManagerCatalogPrice from '@ovh-ux/manager-catalog-price';

import component from './private-order.component';
import routing from './private-order.routing';

const moduleName = 'ovhManagerDedicatedServerBandwidthPrivateOrder';

angular
  .module(moduleName, ['ui.router', ovhManagerCatalogPrice])
  .component('dedicatedServerBandwidthPrivateOrder', component)
  .config(routing);

export default moduleName;
