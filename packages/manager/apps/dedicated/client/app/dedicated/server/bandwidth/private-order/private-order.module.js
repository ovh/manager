import ovhManagerCatalogPrice from '@ovh-ux/manager-catalog-price';

import angular from 'angular';
import '@uirouter/angularjs';
import { serverOrderPrivateBandwidth } from '@ovh-ux/manager-bm-server-components';

import component from './private-order.component';
import routing from './private-order.routing';

const moduleName = 'ovhManagerDedicatedServerBandwidthPrivateOrder';

angular
  .module(moduleName, [
    'ui.router',
    ovhManagerCatalogPrice,
    serverOrderPrivateBandwidth,
  ])
  .component('dedicatedServerBandwidthPrivateOrder', component)
  .config(routing);

export default moduleName;
