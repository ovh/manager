import ovhManagerCatalogPrice from '@ovh-ux/manager-catalog-price';

import component from './public-order.component';
import routing from './public-order.routing';

const moduleName = 'ovhManagerDedicatedClusterNodeBandwidthPublicOrder';

angular
  .module(moduleName, ['ui.router', ovhManagerCatalogPrice])
  .component('dedicatedClusterNodeBandwidthPublicOrder', component)
  .config(routing);

export default moduleName;
