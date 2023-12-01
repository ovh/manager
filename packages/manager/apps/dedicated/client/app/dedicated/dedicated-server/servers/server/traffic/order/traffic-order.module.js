import angular from 'angular';
import '@uirouter/angularjs';

import { serverConsumptionTile } from '@ovh-ux/manager-bm-server-components';

import routing from './traffic-order.routing';

const moduleName = 'ovhManagerDedicatedServerTrafficOrder';

angular
  .module(moduleName, ['ui.router', serverConsumptionTile])
  .config(routing);

export default moduleName;
