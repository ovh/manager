import angular from 'angular';

import component from './component';
import routing from './routing';

const moduleName = 'ovhManagerOctaviaLoadBalancerPoolsDetailHealthMonitorEdit';

angular
  .module(moduleName, [])
  .config(routing)
  .component('octaviaLoadBalancerPoolsDetailHealthMonitorEdit', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
