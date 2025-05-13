import ovhManagerCatalogPrice from '@ovh-ux/manager-catalog-price';

import angular from 'angular';
import '@uirouter/angularjs';
import { serverOrderPrivateBandwidth } from '@ovh-ux/manager-bm-server-components';

import component from './private-order.component';
import routing from './private-order.routing';

const moduleName = 'ovhManagerDedicatedClusterNodeBandwidthPrivateOrder';

angular
  .module(moduleName, [
    'ui.router',
    ovhManagerCatalogPrice,
    serverOrderPrivateBandwidth,
  ])
  .component('dedicatedClusterNodeBandwidthPrivateOrder', component)
  .config(routing);

export default moduleName;
