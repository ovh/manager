import angular from 'angular';

import component from './component';
import routing from './routing';
import service from './service';

import create from './create';
import healthMonitorComponents from './components';

const moduleName = 'ovhManagerOctaviaLoadBalancerPoolsDetailHealthMonitor';

angular
  .module(moduleName, [healthMonitorComponents, create])
  .config(routing)
  .component('octaviaLoadBalancerPoolsDetailHealthMonitor', component)
  .service('OctaviaLoadBalancerHealthMonitorService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
