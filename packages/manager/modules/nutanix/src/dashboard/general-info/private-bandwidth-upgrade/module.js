import angular from 'angular';
import '@uirouter/angularjs';
import nutanixClusterorderPrivateBandwidth from '../../component/order-private-bandwidth/order-private-bandwidth.module';

import component from './component';
import routing from './routing';

const moduleName = 'ovhManagerNutanixGeneralInfoPrivateBandwidthUpgrade';

angular
  .module(moduleName, ['ui.router', nutanixClusterorderPrivateBandwidth])
  .component('nutanixClusterPrivateBandwidthUpgrade', component)
  .config(routing);

export default moduleName;
