import ovhManagerCatalogPrice from '@ovh-ux/manager-catalog-price';

import component from './public-order.component';
import routing from './public-order.routing';

const moduleName = 'ovhManagerDedicatedServerBandwidthPublicOrder';

angular
  .module(moduleName, ['ui.router', ovhManagerCatalogPrice])
  .component('dedicatedServerBandwidthPublicOrder', component)
  .config(routing);

export default moduleName;
