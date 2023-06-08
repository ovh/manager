import angular from 'angular';
import '@uirouter/angularjs';
import { serverOrderPrivateBandwidth } from '@ovh-ux/manager-bm-server-components';

import component from './bandwidth-private-order.component';
import routing from './bandwidth-private-order.routing';

const moduleName = 'ovhManagerNutanixNodeGeneralInfoBandwidthPrivateOrder';

angular
  .module(moduleName, ['ui.router', serverOrderPrivateBandwidth])
  .component('nutanixNodeGeneralInfoBandwidthPrivateOrder', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
