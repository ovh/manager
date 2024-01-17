import angular from 'angular';

import component from './component';
import routing from './routing';

const moduleName =
  'ovhManagerOctaviaLoadBalancerPoolsDetailHealthMonitorCreate';

angular
  .module(moduleName, [])
  .config(routing)
  .component('octaviaLoadBalancerPoolsDetailHealthMonitorCreate', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
