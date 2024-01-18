import angular from 'angular';

import component from './component';
import routing from './routing';
import service from './service';

import create from './create';

const moduleName = 'ovhManagerOctaviaLoadBalancerPoolsDetailHealthMonitor';

angular
  .module(moduleName, [create])
  .config(routing)
  .component('octaviaLoadBalancerPoolsDetailHealthMonitor', component)
  .service('OctaviaLoadBalancerHealthMonitorService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
