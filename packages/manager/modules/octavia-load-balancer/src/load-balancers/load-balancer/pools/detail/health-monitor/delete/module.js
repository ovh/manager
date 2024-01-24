import angular from 'angular';

import component from './component';
import routing from './routing';

const moduleName =
  'ovhManagerOctaviaLoadBalancerPoolsDetailHealthMonitorDelete';

angular
  .module(moduleName, [])
  .config(routing)
  .component('octaviaLoadBalancerPoolsDetailHealthMonitorDelete', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
